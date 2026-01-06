'use client';

import { useRouter } from 'next/navigation';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { postSpeechesStt } from '@/lib/api/speeches';

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
        <button onClick={startRecording}>말하기</button>
      ) : (
        <button onClick={stopRecording}>말하기 종료</button>
      )}

      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
          <button onClick={submitAnswer}>제출</button>
        </div>
      )}
    </div>
  );
}
