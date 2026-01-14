'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/mainQuiz/useAudioRecorder';
import { useMicrophoneManager } from '@/hooks/mainQuiz/useMicrophoneManager';
import { postSpeechesStt } from '@/services/speechesApi';
import { ApiError } from '@/services/http/errors';
import { Button } from '@/components/Button';
import { useQuizStore } from '@/store/quizStore';
import { useVideoManager } from '@/hooks/mainQuiz/useVideoManager';
import { getRecorderConfig } from '@/utils/recorder';

interface AudioRecorderProps {
  quizId: number;
}

export type RecordStatus =
  | 'idle' // 초기 진입 (권한 확인 중 포함)
  | 'recording' // 녹음 중
  | 'recorded' // 녹음 완료
  | 'submitting'; // 제출 중

export default function AudioRecorder({ quizId }: AudioRecorderProps) {
  const router = useRouter();
  const { setSolvedQuizId } = useQuizStore();

  const [isConsentOpen, setIsConsentOpen] = useState(true);
  const [isCameraConsentOpen, setIsCameraConsentOpen] = useState(true);
  const [recordStatus, setStatus] = useState<RecordStatus>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

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

  const handleConsentAgree = async () => {
    setIsConsentOpen(false);
    await requestPermission();
  };

  const handleConsentDeny = () => {
    setIsConsentOpen(false);
    denyPermission();
  };

  const handleCameraConsentAgree = async () => {
    setIsCameraConsentOpen(false);
    await requestVideoPermission();
  };

  const handleCameraConsentDeny = () => {
    setIsCameraConsentOpen(false);
    denyVideoPermission();
  };

  // 선택한 카메라로 스트림 시작
  const startCamera = async (deviceId?: string) => {
    if (videoStatus !== 'granted') {
      setError('카메라 권한이 필요합니다.');
      return;
    }

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
      chunksRef.current = [];

      const config = getRecorderConfig();

      const mediaRecorder = new MediaRecorder(
        stream,
        config.mimeType ? { mimeType: config.mimeType } : {},
      );

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: config.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideos((prev) => [...prev, url]);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error('녹화 시작 오류:', err);
      setError('녹화를 시작할 수 없습니다.');
    }
  };

  // 녹화 종료
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  // 비디오 녹화 초기화
  const resetVideoRecording = () => {
    // 1. 진행 중인 녹화 중지
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }

    // 2. 녹화된 비디오 목록 초기화
    // 기존 URL 메모리 해제
    recordedVideos.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setRecordedVideos([]);
    chunksRef.current = [];
  };

  // 디바이스 변경 시 카메라 재시작
  useEffect(() => {
    if (videoStatus === 'granted') {
      const deviceId = getSelectedVideoDeviceId();
      const timer = setTimeout(() => {
        startCamera(deviceId);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [selectedVideoId, videoStatus]);

  // 컴포넌트 언마운트 시 정리
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
      setMessage('녹음중...');
    } catch {
      setMessage('녹음을 시작할 수 없습니다.');
    }
  };

  const handleStop = () => {
    setMessage(null);
    stopRecording();
    stopVideoRecording();
  };

  const handleRetry = () => {
    resetRecording();
    resetVideoRecording();
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
      {/* 제출 중 로딩 모달 */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <div className="text-base font-semibold text-gray-900">음성 답변 처리 중...</div>
            <p className="text-sm text-gray-600">STT 변환이 진행 중입니다. 잠시만 기다려주세요.</p>
          </div>
        </div>
      )}

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

      {/* 카메라 권한 안내 팝업창 */}
      {isCameraConsentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <div className="text-base font-semibold text-gray-900">카메라 권한 안내</div>
              <p className="text-sm text-gray-700">
                말하기 답변을 녹음하며 모습을 촬영하기 위해서는 카메라 권한이 필요합니다.
              </p>
              <p className="text-sm text-gray-700">거부하면 녹화 기능을 사용할 수 없습니다.</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="fixed" onClick={handleCameraConsentDeny}>
                거부
              </Button>
              <Button variant="primary" size="fixed" onClick={handleCameraConsentAgree}>
                동의
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠: 좌우 레이아웃 */}
      <div className="px-12 py-12 md:px-16 md:py-16 lg:px-24 lg:py-24 xl:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-6 lg:col-span-3">
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
              {isRecording && (
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-medium">녹화 중</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            {/* 카메라 선택 */}
            <div className="relative space-y-2">
              <div className="text-sm font-medium text-gray-800">카메라</div>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-4 pr-10 text-sm appearance-none cursor-pointer"
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
              {/* 커스텀 화살표 */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none translate-y-[10px]">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* 마이크 선택 */}
            <div className="relative space-y-2">
              <div className="text-sm font-medium text-gray-800">마이크</div>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-4 appearance-none cursor-pointer text-sm"
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
              {/* 커스텀 화살표 */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none translate-y-[10px]">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

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
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              {recordStatus === 'idle' && (
                <>
                  <Button
                    variant="primary"
                    size="fixed"
                    onClick={handleStart}
                    disabled={!canRecord}
                  >
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
      </div>

      {/* 녹화된 비디오 목록 - 하단에 중앙 배치 */}
      {recordedVideos.length > 0 && (
        <div className="mt-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">녹화된 영상</h2>
          <div className="w-full max-w-md">
            <div className="space-y-3">
              {recordedVideos.map((url, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">녹화 {index + 1}</p>
                  <video
                    src={url}
                    controls
                    className="w-full rounded-lg mb-2"
                    style={{ maxHeight: '250px' }}
                  />
                  <a
                    href={url}
                    download={`recording-${index + 1}.webm`}
                    className="inline-block w-full text-center px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                  >
                    다운로드
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
