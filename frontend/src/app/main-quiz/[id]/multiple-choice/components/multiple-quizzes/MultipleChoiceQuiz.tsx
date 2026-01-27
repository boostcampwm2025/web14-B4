'use client';

import { MultipleChoice, MultipleChoiceOption } from '@/types/multipleChoice.types';
import Choice from './Choice';
import { useMemo, useState } from 'react';
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
  const [selectedOption, setSelectedOption] = useState<MultipleChoiceOption | null>(null);
  const shuffledOptions = useMemo(() => {
    if (!currentQuiz || !currentQuiz.options) return [];
    return shuffle([...currentQuiz.options]);
  }, [currentQuiz]);

  const handleSelect = (option: MultipleChoiceOption) => {
    setSelectedOption(option);
  };

  const content = currentQuiz ? currentQuiz.content : '문제가 존재하지 않습니다.';

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <h2 className="max-w-3/4 py-2 my-5 text-2xl font-semibold leading-8 text-center">
        {content}
      </h2>

      <div className="flex flex-col items-center gap-5 mt-6">
        {shuffledOptions.map((option) => (
          <Choice
            key={option.multipleQuizOptionId}
            optionInfo={option}
            isSelected={selectedOption?.multipleQuizOptionId === option.multipleQuizOptionId}
            onSelect={() => handleSelect(option)}
          />
        ))}
      </div>

      <div className="mt-10 min-h-[120px] w-full max-w-150 px-6">
        {selectedOption && (
          <div
            className={`p-6 rounded-2xl border-2 transition-all duration-300 animate-in fade-in zoom-in-95 ${
              selectedOption.isCorrect
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {selectedOption.isCorrect ? <span className="text-lg">✨</span> : <></>}
              <p className="font-bold">{selectedOption.isCorrect ? '정답입니다!' : '오답입니다'}</p>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">{selectedOption.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
