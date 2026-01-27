'use client';

import { useRef, useState, useEffect } from 'react';
import { buildAudioFilename, getAudioExtension, getAudioRecorderConfig } from '@/utils/recorder';

type StartRecordingParams = {
  deviceId?: string;
};

type UseAudioRecorderParams = {
  onRecorded?: (result: { blob: Blob; url: string } | null) => void;
};

type RecordingManifest = {
  mimeType: string;
  extension: string;
  filename: string;
};

export function useAudioRecorder(params?: UseAudioRecorderParams) {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioUrlRef = useRef<string | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioManifest, setAudioManifest] = useState<RecordingManifest | null>(null);

  // 오디오 스트림 종료
  const cleanupStream = () => {
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioStreamRef.current = null;
  };

  const cleanupRecorder = () => {
    // 녹음 중이면 멈춤
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    mediaRecorderRef.current = null;
  };

  // URL 정리
  const cleanupUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const resetRecording = () => {
    cleanupRecorder();
    cleanupStream();
    cleanupUrl();

    // 상태 초기화
    audioChunksRef.current = [];
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioManifest(null);
  };

  const startRecording = async (startParams?: StartRecordingParams) => {
    // 기존 결과 정리
    audioChunksRef.current = [];
    setAudioBlob(null);
    setAudioManifest(null);
    cleanupUrl();
    setAudioUrl(null);

    const constraints: MediaStreamConstraints = {
      audio: startParams?.deviceId ? { deviceId: { exact: startParams.deviceId } } : true,
    };

    // 마이크 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    audioStreamRef.current = stream;

    const config = getAudioRecorderConfig();

    // TODO 임시코드 삭제필요: 요청한 mimeType 로그
    console.log('[AUDIO][Recorder] 요청 mimeType:', config.mimeType || '(none)');

    const recorder = new MediaRecorder(
      stream,
      config.mimeType ? { mimeType: config.mimeType } : undefined,
    );
    mediaRecorderRef.current = recorder;

    // 녹음 데이터 수집
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const actualMimeType = recorder.mimeType || config.mimeType || 'audio/webm';
      const extension = getAudioExtension(actualMimeType);
      const filename = buildAudioFilename(extension);

      // TODO 임시코드 삭제필요: 실제 mimeType 로그 + 비교 로그
      console.log('[AUDIO][Recorder] 실제 mimeType:', recorder.mimeType || '(empty)');
      console.log('[AUDIO][Recorder] 요청 vs 실제 mimeType 비교:', {
        요청: config.mimeType || '(none)',
        실제: recorder.mimeType || '(empty)',
        최종사용: actualMimeType,
        동일여부: (config.mimeType || '') === (recorder.mimeType || ''),
      });

      // 구버전 크롬에서 onstop이 ondataavailable 마지막 flush보다 먼저 올 수 있어 한 틱 대기
      if (audioChunksRef.current.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const blob = new Blob(audioChunksRef.current, { type: actualMimeType });

      // 녹음 실패 케이스
      if (blob.size === 0) {
        // TODO 임시코드 삭제필요
        console.error('[AUDIO][Recorder] 녹음 결과가 비어있음. 재녹음 필요');

        // 내부 상태 정리
        audioChunksRef.current = [];
        cleanupStream();
        cleanupUrl();

        // 상위 컴포넌트에 녹음 실패 신호 전달
        params?.onRecorded?.(null);

        return;
      }

      // TODO 임시코드 삭제필요: 크롬 13x에서 blob.size가 작거나 0이면 flush/마무리 문제 가능성 큼
      console.log('[AUDIO][Recorder] chunks/blob.size:', {
        chunks: audioChunksRef.current.length,
        size: blob.size,
      });

      setAudioBlob(blob);
      setAudioManifest({
        mimeType: actualMimeType,
        extension,
        filename,
      });

      // 브라우저에서 재생 가능한 URL 생성
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      setAudioUrl(url);

      // 녹음 완료 콜백
      params?.onRecorded?.({ blob, url });

      // 스트림 종료는 stop 직후가 아니라 onstop 이후에 수행 (파일 마무리 깨지는 것 방지)
      cleanupStream();
    };

    recorder.start();
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      return;
    }

    // 녹음 중일 때만 stop
    if (recorder.state !== 'recording') {
      return;
    }

    // stop 전에 한 번 강제로 flush 요청 (마지막 데이터 누락 방지)
    try {
      recorder.requestData();
    } catch {
      // ignore
    }

    recorder.stop();
  };

  useEffect(() => {
    return () => {
      // 페이지 이탈/언마운트 시 리소스 정리
      cleanupRecorder();
      cleanupStream();
      cleanupUrl();
      audioChunksRef.current = [];
    };
  }, []);

  return {
    audioUrl,
    audioBlob,
    audioManifest,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
