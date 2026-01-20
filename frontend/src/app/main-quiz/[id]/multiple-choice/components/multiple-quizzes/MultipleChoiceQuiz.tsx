'use client';

import { MultipleChoice } from '@/types/multipleChoice.types';
import Choice from './Choice';

interface MultipleQuizProps {
  multipleChoiceQuizzes: MultipleChoice[];
  quizNumber: number;
}

export default function MultipleChoiceQuiz({
  multipleChoiceQuizzes,
  quizNumber: quizIndex,
}: MultipleQuizProps) {
  const currentQuiz = multipleChoiceQuizzes[quizIndex];

  if (!currentQuiz) {
    return null;
  }

  const { content, options } = currentQuiz;

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <h2 className="max-w-3/4 py-2 my-5 text-2xl font-semibold leading-8">{content}</h2>

      <div className="flex flex-col items-center gap-5 mt-6">
        {options.map((option) => (
          <Choice
            key={option.multipleQuizOptionId}
            text={option.option}
            isCorrect={option.isCorrect}
          />
        ))}
      </div>
    </div>
  );
}
