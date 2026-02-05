'use client';

import { useEffect, useRef, useState } from 'react';
import { getVideoRecorderConfig } from '@/utils/videoRecorderConfig';

export function useVideoRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [error, setError] = useState<string>('');

  // 선택한 카메라로 스트림 시작
  const setCameraStream = async (deviceId?: string) => {
    try {
      // 기존 스트림 정리
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setStream(newStream);
        setError('');
      }
    } catch (err) {
      console.error('카메라 시작 오류:', err);
      setError('카메라를 시작할 수 없습니다.');
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // 녹화 시작
  const startVideoRecording = () => {
    if (!stream) {
      setError('먼저 카메라를 시작해주세요.');
      return;
    }

    try {
      videoChunksRef.current = [];

      const config = getVideoRecorderConfig();

      const mediaRecorder = new MediaRecorder(
        stream,
        config.mimeType ? { mimeType: config.mimeType } : {},
      );

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, {
          type: config.mimeType || 'video/webm',
        });

        // 기존 URL 정리
        if (recordedVideoUrl) {
          URL.revokeObjectURL(recordedVideoUrl);
        }

        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        videoChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsVideoRecording(true);
    } catch (err) {
      console.error('녹화 시작 오류:', err);
      setError('녹화를 시작할 수 없습니다.');
    }
  };

  // 녹화 종료
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isVideoRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsVideoRecording(false);
    }
  };

  // 비디오 녹화 초기화
  const resetVideoRecording = () => {
    if (mediaRecorderRef.current && isVideoRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsVideoRecording(false);
    }

    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }

    setRecordedVideoUrl(null);
    videoChunksRef.current = [];
  };

  // unmount 시, 비디오 메모리 정리
  useEffect(() => {
    return () => {
      stopCamera();

      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, []);

  return {
    videoRef,
    recordedVideoUrl,
    isVideoRecording,
    error,
    setError,
    setCameraStream,
    stopCamera,
    startVideoRecording,
    stopVideoRecording,
    resetVideoRecording,
  };
}
