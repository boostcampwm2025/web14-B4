'use client';

import { useRef, useState, useEffect } from 'react';
import { buildAudioFilename } from '@/utils/recorder';
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
  const audioUrlRef = useRef<string | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioManifest, setAudioManifest] = useState<RecordingManifest | null>(null);

  const recordRtcRef = useRef<RecordRTC | null>(null);

  // 오디오 스트림 종료
  const cleanupStream = () => {
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioStreamRef.current = null;
  };

  const cleanupRecorder = () => {
    // RecordRTC 사용 중이면 ref 정리(실제 stop은 stopRecording에서 처리)
    recordRtcRef.current = null;
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
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioManifest(null);
  };

  const startRecording = async (startParams?: StartRecordingParams) => {
    // 기존 결과 정리
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
  };

  const stopRecording = async () => {
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
  };

  useEffect(() => {
    return () => {
      // 페이지 이탈/언마운트 시 리소스 정리
      cleanupRecorder();
      cleanupStream();
      cleanupUrl();
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
