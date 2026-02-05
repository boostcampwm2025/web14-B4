'use client';

export default function QuizIntro() {
  return (
    <div className="flex flex-col gap-0.5 text-left py-2 mt-3">
      <h3 className="text-2xl font-semibold text-gray-900 py-2">CS 객관식 퀴즈</h3>
      <p className="text-xs text-gray-500">문제를 읽고 답을 선택해보세요!</p>
    </div>
  );
}
