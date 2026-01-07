"use client";

import { Quiz } from "@/src/types/quiz";

interface QuizCardProps {
    quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
return (
    <div className="border-[var(--color-gray-light)] rounded-lg p-8 bg-white">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold mb-5 text-gray-800">
            {quiz.title}
        </h3>
        <span className={`px-3 py-2 rounded-full text-m ${
          quiz.difficultyLevel === '상' ? 'bg-[var(--color-difficulty-high-bg)] text-[var(--color-difficulty-high-text)]' :
          quiz.difficultyLevel === '중' ? 'bg-[var(--color-difficulty-mid-bg)] text-[var(--color-difficulty-mid-text)]' :
          'bg-[var(--color-difficulty-low-bg)] text-[var(--color-difficulty-low-text)]'
        }`}>
          {quiz.difficultyLevel}
        </span>
      </div>

      <span className="p-2 border border-[var(--color-gray-light)] text-m rounded-full">{quiz.category.name}</span>


      <button 
        className="w-full bg-[var(--color-primary)] hover:bg-blue-600 text-white text-xl py-2 rounded-md transition mt-15"
        onClick={() => alert(`${quiz.id}번 문제 풀러 가기 (구현 예정)`)}
      >
        시작하기
      </button>
    </div>
  );
}