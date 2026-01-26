'use client';

import { Quiz } from '@/app/quizzes/types/quiz';
import { useState } from 'react';
import QuizTypeSelectPopup from '../QuizTypeSelectPopup';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 난이도별 스타일 매핑
  const difficultyStyles = {
    상: 'bg-red-50 text-red-600 border-red-100',
    중: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    하: 'bg-green-50 text-green-600 border-green-100',
  };

  return (
    <div>
      <div className="group relative flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-in-out">
        {/* 상단 */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
            {quiz.quizCategory.name}
          </span>
          <span
            className={`px-2 py-1 text-xs font-bold border rounded-md ${difficultyStyles[quiz.difficultyLevel as keyof typeof difficultyStyles]}`}
          >
            {quiz.difficultyLevel}
          </span>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
            {quiz.title}
          </h3>
        </div>

        <button
          className="w-full py-3 px-4 bg-gray-50 text-gray-900 font-semibold rounded-xl group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setIsPopupOpen(true)}
        >
          <span>시작하기</span>
          <svg
            className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>
      <QuizTypeSelectPopup quiz={quiz} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
