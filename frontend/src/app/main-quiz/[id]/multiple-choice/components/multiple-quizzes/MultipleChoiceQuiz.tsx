'use client';

import Choice from './Choice';

export default function MultipleChoiceQuiz() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">
        다음 중 스택에 대한 설명 중 옳지 않은 것을 고르시오
      </h2>
      <div className="flex flex-col items-center gap-5 mt-6">
        <Choice />
        <Choice />
        <Choice />
        <Choice />
        <Choice />
      </div>
    </div>
  );
}
