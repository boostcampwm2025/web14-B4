'use client';

export default function FeedbackQuestions({ questions }: { questions: string[] }) {
  if (!questions || questions.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl">
              🤔
            </div>
            <h2 className="text-lg font-bold tracking-tight text-(--color-accent-navy)">
              생각을 넓혀주는 추가 질문
            </h2>
          </div>
        </div>

        {/* 질문 리스트 영역 */}
        <ul className="grid grid-cols-1 gap-4">
          {questions.map((question, idx) => (
            <li
              key={idx}
              className="group flex items-start gap-4 p-4 rounded-xl border border-transparent bg-(--color-gray-light)/20 hover:bg-white hover:border-(--color-accent-sky) hover:shadow-sm transition-all duration-300"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-(--color-accent-sky) text-[12px] font-bold text-(--color-primary) group-hover:bg-(--color-accent-sky) group-hover:text-(--color-accent-navy) transition-colors">
                Q{idx + 1}
              </span>
              <p className="text-md leading-relaxed text-(--color-gray-dark) group-hover:text-black transition-colors">
                {question}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
