'use client';

import Choice from './Choice';

export default function MultipleChoiceQuiz() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      <h2 className="max-w-3/4 py-2 mb-3 text-2xl font-semibold leading-8">
        다음 중 스택과 큐에 대한 설명 중 옳지 않은 것을 고르세요. 마나아자로을 핤 수
        있습ㅂ니다이다링나할 수 있기 때문일까요?
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
