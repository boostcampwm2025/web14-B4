'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

interface Props {
  quizId: number;
}

export default function TextAnswer({ quizId }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => text.trim().length > 0, [text]);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      // TODO: 텍스트 답변 제출 API 연결
      // await postTextAnswer({ quizId, text });

      router.push(`/checklist/main-quiz/${quizId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[720px] px-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <textarea
          id="text-answer"
          className="rounded-xl p-6 border-2 mb-6 w-full min-h-[400px] resize-none overflow-y-auto text-gray-800 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ backgroundColor: '#4278FF10', borderColor: '#4278FF' }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="답변을 입력해주세요..."
        />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">{text.trim().length}자 / 3800자</p>
          <Button
            size="fixed"
            variant={isValid ? 'primary' : 'secondary'}
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
          >
            제출
          </Button>
        </div>
      </div>
    </div>
  );
}
