'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { MAX_SPEECH_TEXT_LENGTH, MIN_SPEECH_TEXT_LENGTH } from '@/constants/speech.constants';
import { postSpeechTextAnswer } from '@/services/apis/speechesApi';
import { ApiError } from '@/services/http/errors';
import { toast } from 'react-toastify';
import { useQuizStore } from '@/store/quizStore';

interface Props {
  quizId: number;
}

export default function TextAnswer({ quizId }: Props) {
  const router = useRouter();
  const { setSolvedQuizId } = useQuizStore();

  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedLength = useMemo(() => text.trim().length, [text]);
  const isValid = useMemo(() => trimmedLength >= MIN_SPEECH_TEXT_LENGTH, [trimmedLength]);

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const speechTextValue = e.target.value;

    if (speechTextValue.length > MAX_SPEECH_TEXT_LENGTH) {
      return;
    }

    setText(speechTextValue);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (trimmedLength < MIN_SPEECH_TEXT_LENGTH) {
      toast.error(`답변은 최소 ${MIN_SPEECH_TEXT_LENGTH}자 이상 작성해야 합니다.`);
      return;
    }

    try {
      setIsSubmitting(true);

      const { solvedQuizId } = await postSpeechTextAnswer(quizId, text);
      setSolvedQuizId(solvedQuizId);

      router.push(`/checklist/main-quiz/${quizId}`);
    } catch (e) {
      let errorMessage = '제출에 실패했습니다. 다시 시도해주세요.';

      if (e instanceof ApiError) {
        errorMessage = e.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    const confirmed = window.confirm(
      '작성중인 답변이 제출되지 않았습니다.\n퀴즈 목록 페이지로 나가시겠습니까?',
    );

    if (!confirmed) {
      return;
    }

    router.push('/quizzes');
  };

  return (
    <div className="mx-auto w-full max-w-[720px] px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <textarea
          id="text-answer"
          className="rounded-xl p-6 border-2 mb-6 w-full min-h-[400px] resize-none overflow-y-auto text-gray-800 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ backgroundColor: '#4278FF10', borderColor: '#4278FF' }}
          value={text}
          onChange={handleChangeText}
          placeholder="답변을 입력해주세요..."
        />

        <div className="mt-1 flex flex-col gap-1">
          {/* 최소 글자 수 안내 */}
          {trimmedLength < MIN_SPEECH_TEXT_LENGTH && (
            <p className="text-sm text-red-500">
              최소 {MIN_SPEECH_TEXT_LENGTH}자 이상 입력해주세요.
            </p>
          )}
          <div className="mt-1 flex items-center">
            <p className="text-sm text-gray-500">
              {trimmedLength}자 / {MAX_SPEECH_TEXT_LENGTH}자
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              size="fixed"
              variant={'primary'}
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit}
            >
              제출
            </Button>
            <Button size="fixed" variant="secondary" onClick={handleExit}>
              나가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
