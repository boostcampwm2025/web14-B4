'use client';

import { MultipleChoiceResponseDto } from '@/types/multipleChoice.types';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import ProgressBar from './ProgressBar';
import { useState } from 'react';
import ArrowButtons from '../arrowBtn/ArrowButtons';

interface ContainerProps {
  multipleQuizzesInfo: MultipleChoiceResponseDto;
}

export default function MultipleQuizContainer({ multipleQuizzesInfo }: ContainerProps) {
  const [quizIndex, setQuizIndex] = useState(0);

  const maxIndex = multipleQuizzesInfo.multipleChoices.length - 1;

  const handlePrev = () => {
    setQuizIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setQuizIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <>
      <div className="relative w-full flex flex-col">
        <ProgressBar current={quizIndex} total={multipleQuizzesInfo.totalCount} />

        <MultipleChoiceQuiz
          multipleChoiceQuizzes={multipleQuizzesInfo.multipleChoices}
          quizNumber={quizIndex}
        />

        <ArrowButtons
          onPrev={handlePrev}
          onNext={handleNext}
          disablePrev={quizIndex === 0}
          disableNext={quizIndex === maxIndex}
        />
      </div>
    </>
  );
}
