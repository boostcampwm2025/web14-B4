'use client';

import { MultipleChoiceResponseDto } from '@/types/multipleChoice.types';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import ProgressBar from './ProgressBar';
import { useState } from 'react';
import ArrowButtons from '../arrowBtn/ArrowButtons';
import Popup from '@/components/Popup';
import { useRouter } from 'next/navigation';

interface ContainerProps {
  multipleQuizzesInfo: MultipleChoiceResponseDto;
}

export default function MultipleQuizContainer({ multipleQuizzesInfo }: ContainerProps) {
  const router = useRouter();
  const [quizIndex, setQuizIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const maxIndex = multipleQuizzesInfo.multipleChoices.length - 1;

  const handlePrev = () => {
    setQuizIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (quizIndex === maxIndex) {
      setIsPopupOpen(true);
      return;
    }
    setQuizIndex((prev) => prev + 1);
  };

  const handleConfirm = () => {
    router.push(`/main-quiz/${multipleQuizzesInfo.mainQuizId}`);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="relative w-full flex flex-col">
      <ProgressBar current={quizIndex} total={multipleQuizzesInfo.totalCount} />

      <MultipleChoiceQuiz
        key={quizIndex}
        multipleChoiceQuizzes={multipleQuizzesInfo.multipleChoices}
        quizNumber={quizIndex}
      />

      <ArrowButtons
        onPrev={handlePrev}
        onNext={handleNext}
        disablePrev={quizIndex === 0}
        disableNext={false}
      />

      <Popup
        isOpen={isPopupOpen}
        title="메인 퀴즈로 이동하시겠습니까?"
        description="아직 준비되지 않았다면 객관식 퀴즈를 다시 풀어보세요!"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
