'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/mainQuiz/useAudioRecorder';
import { useMicrophoneManager } from '@/hooks/mainQuiz/useMicrophoneManager';
import { postSpeechesStt } from '@/services/apis/speechesApi';
import { ApiError } from '@/services/http/errors';
import { useQuizStore } from '@/store/quizStore';
import { useVideoManager } from '@/hooks/mainQuiz/useVideoManager';
import Loader from '@/components/Loader';
import CombinedPermissionConsentModal from './permission/CombinedPermissionConsentModal';
import MediaDeviceSelect from './MediaDeviceSelect';
import RecordActionButtons from './buttons/RecordActionButtons';
import { useRecordActionButtons } from '@/hooks/mainQuiz/useRecordActionButtons';
import RecordedVideo from './record/RecordedVideo';
import Popup from '@/components/Popup';
import RecorderTimerContainer from './RecorderTimerContainer';
import { MAX_SPEECH_SECONDS, AUDIO_MIMETYPE, AUDIO_FILE_NAME } from '@/constants/speech.constants';
import { useVideoRecorder } from '@/hooks/mainQuiz/useVideoRecorder';

interface AudioRecorderProps {
  quizId: number;
  onSwitchToTextMode: () => void;
}

export type RecordStatus =
  | 'idle' // 초기 진입 (권한 확인 중 포함)
  | 'recording' // 녹음 중
  | 'recorded' // 녹음 완료
  | 'submitting'; // 제출 중

export default function Recorder({ quizId, onSwitchToTextMode }: AudioRecorderProps) {
  const router = useRouter();
  const { setSolvedQuizId } = useQuizStore();

  const [isConsentOpen, setIsConsentOpen] = useState(true);
  const [recordStatus, setStatus] = useState<RecordStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTimeoutPopupOpen, setIsTimeoutPopupOpen] = useState(false);

  const {
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
  } = useVideoRecorder();

  const { audioUrl, audioBlob, startRecording, stopRecording, resetRecording } = useAudioRecorder({
    onRecorded: (blob) => {
      if (!blob) {
        setMessage('녹음 파일 생성에 실패했습니다. 다시 시도해주세요.');
        setStatus('idle');
        return;
      }

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

  const {
    videoStatus,
    message: videoPermissionMessage,
    videoOptions,
    selectedVideoId,
    setSelectedVideoId,
    getSelectedDeviceId: getSelectedVideoDeviceId,
    requestPermission: requestVideoPermission,
    denyPermission: denyVideoPermission,
  } = useVideoManager();

  // 통합 권한 동의 처리
  const handleConsentAgree = async (micChecked: boolean, cameraChecked: boolean) => {
    setIsConsentOpen(false);

    // 선택된 권한 요청
    if (micChecked) {
      await requestPermission();
    }
    if (cameraChecked) {
      await requestVideoPermission();
    }

    // 아무것도 선택 안했을 때 (추후 기능 추가)
    if (!micChecked && !cameraChecked) {
      // TODO: 아무것도 선택 안했을 때 처리
    }
  };

  const handleConsentDeny = () => {
    setIsConsentOpen(false);
    onSwitchToTextMode();
  };

  // 디바이스 변경 시 카메라 재시작
  useEffect(() => {
    if (videoStatus === 'granted') {
      const deviceId = getSelectedVideoDeviceId();
      const timer = setTimeout(() => {
        setCameraStream(deviceId);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [selectedVideoId, videoStatus]);

  // unmount 시, 비디오 메모리 정리
  useEffect(() => {
    return () => {
      stopRecording();
      stopCamera();
    };
  }, []);

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
      startVideoRecording();

      setStatus('recording');
    } catch {
      setMessage('녹음을 시작할 수 없습니다.');
    }
  };

  const handleStop = async () => {
    setMessage(null);
    await stopRecording();
    stopVideoRecording();
    stopCamera();
  };

  const handleRetry = () => {
    resetRecording();
    resetVideoRecording();
    setStatus('idle');
    setMessage(null);
  };

  const handleExit = () => {
    setIsPopupOpen(true);
  };

  const handleConfirm = () => {
    setIsPopupOpen(false);
    router.push('/quizzes');
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      return;
    }
    setStatus('submitting');
    try {
      const { solvedQuizId } = await postSpeechesStt(quizId, {
        blob: audioBlob,
        filename: AUDIO_FILE_NAME,
        mimeType: AUDIO_MIMETYPE,
      });
      setSolvedQuizId(solvedQuizId);

      stopCamera();

      router.push(`/checklist/main-quiz/${quizId}`);
    } catch (e) {
      let errorMessage = '제출에 실패했습니다.';

      if (e instanceof ApiError) {
        errorMessage = e.message;
      }
      setMessage(errorMessage);
      setStatus('recorded');
    }
  };

  const handleTimeout = async () => {
    setIsTimeoutPopupOpen(true);
    await handleStop();
  };

  const handleTimeoutConfirm = () => {
    setIsTimeoutPopupOpen(false);
    setMessage(
      `녹음 시간(${MAX_SPEECH_SECONDS}초)을 초과했습니다. 녹음 내용을 확인한 후 다시 녹음해주세요.`,
    );
    // 여기서 바로 handleRetry()하면 사용자가 녹음 파일을 확인 할 수 없으므로 handleRetry()하지 않음
  };

  const actionButtons = useRecordActionButtons({
    recordStatus,
    canRecord,
    onStart: handleStart,
    onStop: handleStop,
    onRetry: handleRetry,
    onSubmit: handleSubmit,
    onExit: handleExit,
  });

  const isSubmitting = recordStatus === 'submitting';

  return (
    <div className="w-full">
      {/* 제출 중 로딩 모달 */}
      {isSubmitting && (
        <Loader
          message="음성 답변 처리 중..."
          subMessage="STT 변환이 진행 중입니다. 잠시만 기다려주세요."
        />
      )}

      {/* 통합 권한 안내 팝업창 */}
      <CombinedPermissionConsentModal
        isOpen={isConsentOpen}
        onDeny={handleConsentDeny}
        onAgree={handleConsentAgree}
      />

      {/* 메인 컨텐츠: 좌우 레이아웃 */}
      <div className="px-12 py-4 max-w-250 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* 비디오 */}
          <div className="space-y-6 lg:col-span-3">
            <div className="relative w-125 h-70 bg-gray-900 rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isVideoRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">녹화 중</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            {/* 카메라 선택 */}
            <MediaDeviceSelect
              label="카메라"
              value={selectedVideoId}
              options={videoOptions}
              onChange={setSelectedVideoId}
              disabled={recordStatus === 'recording' || isSubmitting}
            />

            {/* 마이크 선택 */}
            <MediaDeviceSelect
              label="마이크"
              value={selectedMicId}
              options={micOptions}
              onChange={setSelectedMicId}
              disabled={recordStatus === 'recording' || isSubmitting}
            />

            {/* 녹음 시간 */}
            <RecorderTimerContainer
              isRecording={recordStatus === 'recording'}
              onTimeout={handleTimeout}
            />

            {/* 메시지 */}
            {(permissionMessage || videoPermissionMessage || message) && (
              <div>
                <div className="rounded-xl text-sm text-red-600">
                  {permissionMessage || message}
                </div>
                <div className="rounded-xl p-3 text-sm text-red-600">{videoPermissionMessage}</div>
              </div>
            )}

            {/* 오디오 미리보기 */}
            {audioUrl && (
              <div className="rounded-xl p-3">
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}

            {/* 버튼 영역 */}
            <RecordActionButtons buttons={actionButtons} />
          </div>
        </div>
      </div>

      {/* 녹화된 비디오 목록 - 하단에 중앙 배치 */}
      <RecordedVideo videoUrl={recordedVideoUrl} />

      <Popup
        isOpen={isPopupOpen}
        title="퀴즈 목록으로 이동하시겠습니까?"
        description="녹음중인 답변이 제출되지 않습니다."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <Popup
        isOpen={isTimeoutPopupOpen}
        title="녹음 시간이 초과되었습니다."
        description={`녹음 시간(${MAX_SPEECH_SECONDS}초)을 초과했습니다. 녹음 내용을 확인한 후 다시 녹음해주세요.`}
        confirmText="확인"
        onConfirm={handleTimeoutConfirm}
        singleButton
      />
    </div>
  );
}
