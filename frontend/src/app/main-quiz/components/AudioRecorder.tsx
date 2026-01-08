'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/mainQuiz/useAudioRecorder';
import { useMicrophoneManager } from '@/hooks/mainQuiz/useMicrophoneManager';
import { postSpeechesStt } from '@/services/speeches';
import { ApiError } from '@/services/http/errors';
import { Button } from '@/components/Button';
import { useQuizStore } from '@/store/quizStore';

export type RecordStatus =
  | 'idle' // 초기 진입 (권한 확인 중 포함)
  | 'recording' // 녹음 중
  | 'recorded' // 녹음 완료
  | 'submitting'; // 제출 중

export default function AudioRecorder() {
  const router = useRouter();
  const { setSolvedQuizId } = useQuizStore();

  const [isConsentOpen, setIsConsentOpen] = useState(true);
  const [recordStatus, setStatus] = useState<RecordStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const { audioUrl, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder({
    onRecorded: () => {
      setStatus('recorded');
    },
  });

  const {
    micStatus,
    message: permissionMessage,
    micOptions,
    selectedMicId,
    setSelectedMicId,
    getSelectedDeviceId,
    requestPermission,
    denyPermission,
  } = useMicrophoneManager();

  const handleConsentAgree = async () => {
    setIsConsentOpen(false);
    await requestPermission();
  };

  const handleConsentDeny = () => {
    setIsConsentOpen(false);
    denyPermission();
  };

  // 녹음 가능한 상태 체크
  const canRecord = recordStatus === 'idle' && micStatus === 'granted';

  const handleStart = async () => {
    setMessage(null);

    if (micStatus !== 'granted') {
      await requestPermission();
      return;
    }

    try {
      await startRecording({
        deviceId: getSelectedDeviceId(),
      });
      setStatus('recording');
      setMessage('녹음중...');
    } catch {
      setMessage('녹음을 시작할 수 없습니다.');
    }
  };

  const handleStop = () => {
    setMessage(null);
    stopRecording();
  };

  const handleRetry = () => {
    resetRecording();
    setStatus('idle');
    setMessage(null);
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      return;
    }

    setStatus('submitting');

    try {
      const MAIN_QUIZ_ID = 1;
      const { solvedQuizId } = await postSpeechesStt(MAIN_QUIZ_ID, audioBlob);
      setSolvedQuizId(solvedQuizId);
      // solvedQuizId를 전역 상태에 저장해야함.
      router.push(`/checklist/main-quiz/${MAIN_QUIZ_ID}`);
    } catch (e) {
      let errorMessage = '제출에 실패했습니다.';

      if (e instanceof ApiError) {
        errorMessage = e.message;
      }

      setMessage(errorMessage);
      setStatus('recorded');
    }
  };

  const isSubmitting = recordStatus === 'submitting';

  return (
    <div>
      {/* 마이크 권한 안내 팝업창 */}
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
        {/* 마이크 선택 */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">마이크</div>
          <select
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            value={selectedMicId}
            onChange={(e) => setSelectedMicId(e.target.value)}
            disabled={recordStatus === 'recording' || isSubmitting}
          >
            {micOptions.map((opt, idx) => (
              <option key={`${opt.value}-${idx}`} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 메시지 */}
        {(permissionMessage || message) && (
          <div className="rounded-xl bg-white p-3 text-sm text-red-600">
            {permissionMessage || message}
          </div>
        )}

        {/* 오디오 미리보기 */}
        {audioUrl && (
          <div className="rounded-xl bg-white p-3">
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex flex-wrap justify-end gap-3 pt-2">
          {recordStatus === 'idle' && (
            <>
              <Button variant="primary" size="fixed" onClick={handleStart} disabled={!canRecord}>
                말하기
              </Button>
              <Button variant="secondary" size="fixed" onClick={() => router.push('/')}>
                나가기
              </Button>
            </>
          )}

          {/* 녹음중 */}
          {recordStatus === 'recording' && (
            <>
              <Button variant="primary" size="fixed" onClick={handleStop}>
                말하기 종료
              </Button>
              <Button variant="secondary" size="fixed" onClick={() => router.push('/')}>
                나가기
              </Button>
            </>
          )}

          {/* 녹음 완료 */}
          {recordStatus === 'recorded' && (
            <>
              <Button variant="secondary" size="fixed" onClick={handleRetry}>
                다시하기
              </Button>
              <Button variant="primary" size="fixed" onClick={handleSubmit}>
                제출
              </Button>
              <Button variant="secondary" size="fixed" onClick={() => router.push('/')}>
                나가기
              </Button>
            </>
          )}

          {/* 제출 중 */}
          {recordStatus === 'submitting' && (
            <>
              <Button variant="secondary" size="fixed" disabled>
                다시하기
              </Button>
              <Button variant="primary" size="fixed" disabled>
                제출중...
              </Button>
              <Button variant="secondary" size="fixed" disabled>
                나가기
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
