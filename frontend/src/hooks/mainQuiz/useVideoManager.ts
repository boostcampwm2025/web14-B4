'use client';

import { useState } from 'react';

export type VideoStatus =
  | 'checking' // 권한 확인 중
  | 'granted' // 사용 가능
  | 'denied' // 권한 거부
  | 'error';

export type VideoOption = {
  label: string;
  value: string;
};

export function useVideoManager() {
  const [videoStatus, setStatus] = useState<VideoStatus>('checking');
  const [message, setMessage] = useState<string | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('default');

  // 녹화 가능한 디바이스 목록 가져오기
  const loadDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }

    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
    setDevices(videoDevices);

    // 장치 목록 갱신시 선택된 deviceId가 목록에 없으면 default로 되돌림
    const exists = videoDevices.some((d) => d.deviceId === selectedVideoId);
    if (!exists) {
      setSelectedVideoId('default');
    }
  };

  // 카메라 권한 요청
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      // 권한 획득 성공
      setStatus('granted');
      // 임시 스트림 정리
      stream.getTracks().forEach((track) => track.stop());
      // 디바이스 목록 가져오기
      await loadDevices();
    } catch (err) {
      const e = err as DOMException;

      if (e?.name === 'NotAllowedError' || e?.name === 'SecurityError') {
        setStatus('denied');
        setMessage(
          '미러링 기능을 사용하기 위해서는 카메라 권한이 필요합니다. 브라우저 설정에서 카메라를 허용해주세요. 새로고침 후, 카메라 권한 동의를 추가해주세요.',
        );
        return;
      }

      setStatus('error');
      setMessage('카메라 초기화에 실패했습니다.');
    }
  };

  const denyPermission = () => {
    setStatus('denied');
    setMessage(
      '미러링 기능을 사용하기 위해서는 카메라 권한이 필요합니다. 동의 후 카메라를 허용해주세요. 새로고침 후, 카메라 권한 동의를 추가해주세요.',
    );
  };

  const videoOptions: VideoOption[] = [
    { label: 'Select your Camera', value: 'default' },
    ...devices.map((d, idx) => ({
      label: d.label || `카메라 ${idx + 1}`,
      value: d.deviceId,
    })),
  ];

  const getSelectedDeviceId = () => {
    return selectedVideoId !== 'default' ? selectedVideoId : undefined;
  };

  return {
    videoStatus,
    message,
    devices,
    videoOptions,
    selectedVideoId,
    setSelectedVideoId,
    getSelectedDeviceId,
    requestPermission,
    reloadDevices: loadDevices,
    denyPermission,
  };
}
