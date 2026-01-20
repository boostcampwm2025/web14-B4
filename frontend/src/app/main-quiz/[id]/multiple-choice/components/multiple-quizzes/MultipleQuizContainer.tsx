'use client';

import { MultipleChoiceResponseDto } from '@/types/multipleChoice.types';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import ProgressBar from './ProgressBar';

interface ContainerProps {
  multipleQuizzesInfo: MultipleChoiceResponseDto;
  quizNumber: number;
}

export default function MultipleQuizContainer({
  multipleQuizzesInfo,
  quizNumber: quizIndex,
}: ContainerProps) {
  return (
    <div className="w-full flex flex-col">
      <ProgressBar current={quizIndex} total={multipleQuizzesInfo.totalCount} />
      <MultipleChoiceQuiz
        multipleChoiceQuizzes={multipleQuizzesInfo.multipleChoices}
        quizNumber={quizIndex}
      />
    </div>
  );
}
