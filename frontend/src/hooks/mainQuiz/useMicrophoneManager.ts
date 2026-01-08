'use client';

import { useState } from 'react';

export type MicStatus =
  | 'checking' // 권한 확인 중
  | 'granted' // 사용 가능
  | 'denied' // 권한 거부
  | 'error';

export type MicOption = {
  label: string;
  value: string;
};

export function useMicrophoneManager() {
  const [micStatus, setStatus] = useState<MicStatus>('checking');
  const [message, setMessage] = useState<string | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>('default');

  const loadDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }

    const list = await navigator.mediaDevices.enumerateDevices();
    const mics = list.filter((d) => d.kind === 'audioinput').filter((d) => d.deviceId);

    setDevices(mics);

    // 장치 목록 갱신시 선택된 deviceId가 목록에 없으면 default로 되돌림
    const exists = mics.some((d) => d.deviceId === selectedMicId);
    if (!exists) {
      setSelectedMicId('default');
    }
  };

  const requestPermission = async () => {
    setMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());

      setStatus('granted');
      await loadDevices();
    } catch (err) {
      const e = err as DOMException;

      if (e?.name === 'NotAllowedError' || e?.name === 'SecurityError') {
        setStatus('denied');
        setMessage('마이크 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해주세요.');
        return;
      }

      setStatus('error');
      setMessage('마이크 초기화에 실패했습니다.');
    }
  };

  const denyPermission = () => {
    setStatus('denied');
    setMessage('마이크 권한이 필요합니다. 동의 후 마이크를 허용해주세요.');
  };

  const micOptions: MicOption[] = [
    { label: 'Select your Microphone', value: 'default' },
    ...devices.map((d, idx) => ({
      label: d.label || `마이크 ${idx + 1}`,
      value: d.deviceId,
    })),
  ];

  const getSelectedDeviceId = () => {
    return selectedMicId !== 'default' ? selectedMicId : undefined;
  };

  return {
    micStatus,
    message,
    devices,
    micOptions,
    selectedMicId,
    setSelectedMicId,
    getSelectedDeviceId,
    requestPermission,
    reloadDevices: loadDevices,
    denyPermission,
  };
}
