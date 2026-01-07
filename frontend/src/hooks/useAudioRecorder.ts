'use client';

import { useRef, useState } from 'react';

type StartRecordingParams = {
  deviceId?: string;
};

type UseAudioRecorderParams = {
  onRecorded?: (blob: Blob, url: string) => void;
};

export function useAudioRecorder(params?: UseAudioRecorderParams) {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioUrlRef = useRef<string | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const resetRecording = () => {
    // 녹음 중이면 멈춤
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }

    // 스트림 종료
    audioStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioStreamRef.current = null;

    // URL 정리
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    // 상태 초기화
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setAudioUrl(null);
    setAudioBlob(null);
  };

  const startRecording = async (startParams?: StartRecordingParams) => {
    // 기존 결과 정리
    audioChunksRef.current = [];
    setAudioBlob(null);

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);

    const constraints: MediaStreamConstraints = {
      audio: startParams?.deviceId ? { deviceId: { exact: startParams.deviceId } } : true,
    };

    // 마이크 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    audioStreamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    // 녹음 데이터 수집
    recorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);

      // 브라우저에서 재생 가능한 URL 생성
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      setAudioUrl(url);

      // 녹음 완료 콜백
      params?.onRecorded?.(blob, url);
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    audioStreamRef.current?.getTracks().forEach((t) => t.stop()); // 오디오 스트림 종료
    audioStreamRef.current = null;
  };

  return {
    audioUrl,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
