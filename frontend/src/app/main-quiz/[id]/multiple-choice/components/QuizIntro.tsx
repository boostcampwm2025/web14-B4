'use client';

export default function QuizIntro() {
  return (
    <div className="flex flex-col gap-1 text-left py-6">
      <h3 className="text-2xl font-semibold text-gray-900 py-3">
        cs 객관식 퀴즈
      </h3>
      <p className="text-base text-gray-500">
        문제를 읽고 답을 선택해보세요! 여기서 틀린 문제들은 맞춤 리포트에서 복습할 수 있습니다.
      </p>
    </div>
  );
}
