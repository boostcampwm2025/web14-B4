'use client';

import { MultipleChoice } from '@/types/multipleChoice.types';
import Choice from './Choice';
import { useMemo } from 'react';
import { shuffle } from '@/utils/shuffle';

interface MultipleQuizProps {
  multipleChoiceQuizzes: MultipleChoice[];
  quizNumber: number;
}

export default function MultipleChoiceQuiz({
  multipleChoiceQuizzes,
  quizNumber: quizIndex,
}: MultipleQuizProps) {
  const currentQuiz = multipleChoiceQuizzes[quizIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQuiz || !currentQuiz.options) return [];
    return shuffle([...currentQuiz.options]);
  }, [currentQuiz]);

  const content = currentQuiz ? currentQuiz.content : '문제가 존재하지 않습니다.';

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <h2 className="max-w-3/4 py-2 my-5 text-2xl font-semibold leading-8">{content}</h2>

      <div className="flex flex-col items-center gap-5 mt-6">
        {shuffledOptions.map((option) => (
          <Choice key={option.multipleQuizOptionId} optionInfo={option} />
        ))}
      </div>
    </div>
  );
}
