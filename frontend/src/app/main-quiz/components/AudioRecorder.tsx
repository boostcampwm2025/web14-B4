'use client';

import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { postSpeechesStt } from '@/services/speeches';
import { Button } from '@/components/Button';

export default function AudioRecorder() {
  const router = useRouter();

  const { isRecording, audioUrl, audioBlob, startRecording, stopRecording } = useAudioRecorder();

  const submitAnswer = async () => {
    if (!audioBlob) {
      return;
    }

    const { solvedQuizId, text } = await postSpeechesStt(audioBlob);

    router.push(`/checklist/${solvedQuizId}`);
  };

  return (
    <div>
      {!isRecording ? (
        <Button variant="primary" size="fixed" onClick={startRecording}>
          말하기
        </Button>
      ) : (
        <Button variant="primary" size="fixed" onClick={stopRecording}>
          말하기 종료
        </Button>
      )}

      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
          <Button variant="primary" size="fixed" onClick={submitAnswer}>
            제출
          </Button>
        </div>
      )}
    </div>
  );
}
