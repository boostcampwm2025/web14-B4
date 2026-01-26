'use client';

import { useRouter } from 'next/navigation';
import { Quiz } from '../types/quiz';
import {
  QuizEntryMode,
  QUIZ_TYPE_OPTIONS,
  QUIZ_ENTRY_MODES,
  MESSAGES,
} from '@/constants/quizzes.constant';

interface QuizTypeSelectPopupProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizTypeSelectPopup({ quiz, isOpen, onClose }: QuizTypeSelectPopupProps) {
  const router = useRouter();
  if (!isOpen) return null;

  const handleSelect = (mode: QuizEntryMode) => {
    switch (mode) {
      case QUIZ_ENTRY_MODES.MULTIPLE:
        router.push(`/main-quiz/${quiz.mainQuizId}/multiple-choice`);
        break;

      case QUIZ_ENTRY_MODES.SUBJECTIVE:
        alert(MESSAGES.NOT_IMPLEMENTED);
        break;

      case QUIZ_ENTRY_MODES.BOTH:
        alert(MESSAGES.NOT_IMPLEMENTED);
        break;

      case QUIZ_ENTRY_MODES.SKIP:
        router.push(`/main-quiz/${quiz.mainQuizId}`);
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* 배경 */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-lg" />

      {/* 중앙 콘텐츠 컨테이너 */}
      <div className="relative z-10 flex flex-col items-center gap-10 -translate-y-23">
        <div
          className="inline-block text-center cursor-default select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl mb-5 font-semibold tracking-tight text-gray-900">{quiz.title}</h2>
          <p className="text-base text-gray-700 mt-2 font-semibold">
            메인 퀴즈를 풀기 전에, 몸풀기 퀴즈를 풀어보시겠어요?
          </p>
        </div>

        <div className="grid grid-cols-4 gap-8" onClick={(e) => e.stopPropagation()}>
          {QUIZ_TYPE_OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => handleSelect(o.key)}
              className="
                group relative w-44 h-44 rounded-3xl
                bg-white
                border-2 border-[#4A7DFF]
                shadow-lg
                transition-all duration-300
                hover:-translate-y-3
                hover:shadow-[0_20px_40px_rgba(74,125,255,0.25)]
                hover:bg-[var(--color-accent-sky)]
                active:scale-95
                cursor-pointer
              "
            >
              <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-4 text-center cursor-pointer">
                <div className="text-2xl font-semibold text-gray-900 group-hover:text-[#4A7DFF] transition-colors">
                  {o.title}
                </div>
                <div className="text-sm text-gray-500 group-hover:text-[#4A7DFF]/80 leading-relaxed transition-colors">
                  {o.desc}
                </div>
              </div>

              <div
                className="
                  absolute inset-0 rounded-3xl
                  ring-0 ring-[#4A7DFF]/30
                  group-hover:ring-4
                  transition-all
                  pointer-events-none
                "
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
