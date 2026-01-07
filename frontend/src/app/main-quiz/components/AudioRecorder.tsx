'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useMicrophoneManager } from '@/hooks/useMicrophoneManager';
import { postSpeechesStt } from '@/services/speeches';
import { Button } from '@/components/Button';

export default function AudioRecorder() {
  const router = useRouter();

  const [isConsentOpen, setIsConsentOpen] = useState(true);

  const { isRecording, audioUrl, audioBlob, startRecording, stopRecording, resetRecording } =
    useAudioRecorder();
  const {
    status,
    message,
    micOptions,
    selectedMicId,
    setSelectedMicId,
    getSelectedDeviceId,
    requestPermission,
    denyPermission,
  } = useMicrophoneManager();

  const canRecord = status === 'ready';

  const handleConsentAgree = async () => {
    setIsConsentOpen(false);
    await requestPermission();
  };

  const handleConsentDeny = () => {
    setIsConsentOpen(false);
    denyPermission();
  };

  const handleStart = async () => {
    if (!canRecord) {
      await requestPermission();
      return;
    }

    await startRecording({ deviceId: getSelectedDeviceId() });
  };

  const submitAnswer = async () => {
    if (!audioBlob) {
      return;
    }

    const { solvedQuizId } = await postSpeechesStt(audioBlob);

    router.push(`/checklist/${solvedQuizId}`);
  };

  return (
    <div>
      {isConsentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <div className="text-base font-semibold text-gray-900">마이크 권한 안내</div>
              <p className="text-sm text-gray-700">
                말하기 답변을 녹음하여 STT 변환 후 피드백을 제공하려면 마이크 권한이 필요합니다.
              </p>
              <p className="text-sm text-gray-700">
                거부하면 말하기 연습 기능을 사용할 수 없습니다.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="fixed" onClick={handleConsentDeny}>
                거부
              </Button>
              <Button variant="primary" size="fixed" onClick={handleConsentAgree}>
                동의
              </Button>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="text-sm">마이크</div>
        <select
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
          value={selectedMicId}
          onChange={(e) => setSelectedMicId(e.target.value)}
          disabled={!canRecord || isRecording}
        >
          {micOptions.map((opt, idx) => (
            <option key={`${opt.value}-${idx}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {message && <div className="rounded-xl bg-white p-3 text-sm text-red-600">{message}</div>}
      </div>

      {/* 녹음 버튼 */}
      {!isRecording ? (
        <Button variant="primary" size="fixed" onClick={handleStart} disabled={!canRecord}>
          말하기
        </Button>
      ) : (
        <Button variant="primary" size="fixed" onClick={stopRecording}>
          말하기 종료
        </Button>
      )}

      <Button variant="primary" size="fixed" onClick={resetRecording}>
        다시하기
      </Button>

      {/* 녹음 결과 + 제출 */}
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} className="w-full" />
          <Button variant="primary" size="fixed" onClick={submitAnswer}>
            제출
          </Button>
        </div>
      )}
    </div>
  );
}
