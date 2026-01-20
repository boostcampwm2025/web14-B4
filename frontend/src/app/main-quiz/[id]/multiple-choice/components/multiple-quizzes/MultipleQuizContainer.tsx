'use client';

import { MultipleChoiceResponseDto } from '@/types/multipleChoice.types';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import ProgressBar from './ProgressBar';

interface ContainerProps {
  multipleChoices: MultipleChoiceResponseDto;
}

export default function MultipleQuizContainer({ multipleChoices }: ContainerProps) {
  return (
    <div className="w-full flex flex-col">
      <ProgressBar current={3} total={multipleChoices.totalCount} />
      <MultipleChoiceQuiz />
    </div>
  );
}
