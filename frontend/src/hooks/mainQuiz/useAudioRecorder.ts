'use client';

import { useRef, useState, useEffect } from 'react';
import {
  buildAudioFilename,
  getAudioExtension,
  getAudioRecorderConfig,
  getRecorderType,
} from '@/utils/recorder';
import RecordRTC from 'recordrtc';

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

  const recordRtcRef = useRef<RecordRTC | null>(null);
  const recorderTypeRef = useRef<'RECORD_RTC_WAV' | 'NATIVE_WEBM' | null>(null);

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

    // RecordRTC 사용 중이면 ref 정리(실제 stop은 stopRecording에서 처리)
    recordRtcRef.current = null;
    recorderTypeRef.current = null;
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

    const recorderType = getRecorderType();
    recorderTypeRef.current = recorderType;

    // Safari/구버전 Chrome이면 RecordRTC(WAV) 사용
    if (recorderType === 'RECORD_RTC_WAV') {
      const RecordRTC = (await import('recordrtc')).default;

      // 녹음 시작
      const recordRtc = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1,
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000, // 16kHz (용량 절감)
        bufferSize: 16384, // 버퍼 사이즈 (성능/안정성 관련)
      });

      recordRtcRef.current = recordRtc;
      recordRtc.startRecording();
      return;
    }

    // 그외 엣지/최신 버전 크롬 처리
    const config = getAudioRecorderConfig();

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

      // 구버전 크롬에서 onstop이 ondataavailable 마지막 flush보다 먼저 올 수 있어 한 틱 대기
      if (audioChunksRef.current.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      const blob = new Blob(audioChunksRef.current, { type: actualMimeType });

      // 녹음 실패 케이스
      if (blob.size === 0) {
        // 내부 상태 정리
        audioChunksRef.current = [];
        cleanupStream();
        cleanupUrl();

        // 상위 컴포넌트에 녹음 실패 신호 전달
        params?.onRecorded?.(null);

        return;
      }

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

  const stopRecording = async () => {
    // RecordRTC(WAV) 경로 stop 처리 추가 (Safari/구버전 Chrome)
    if (recorderTypeRef.current === 'RECORD_RTC_WAV') {
      const recordRtc = recordRtcRef.current;
      if (!recordRtc) {
        cleanupStream();
        return;
      }

      await new Promise<void>((resolve) => {
        recordRtc.stopRecording(() => resolve());
      });

      const blob = recordRtc.getBlob();
      recordRtcRef.current = null;

      // 녹음 실패 케이스 (Safari에서 0바이트로 떨어질 때 방어)
      if (blob.size === 0) {
        // 내부 상태 정리
        cleanupStream();
        cleanupUrl();

        // 상위 컴포넌트에 녹음 실패 신호 전달
        params?.onRecorded?.(null);
        return;
      }

      const actualMimeType = 'audio/wav';
      const extension = 'wav';
      const filename = buildAudioFilename(extension);

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

      cleanupStream();
      return;
    }

    // 기존 MediaRecorder(webm) stop
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
