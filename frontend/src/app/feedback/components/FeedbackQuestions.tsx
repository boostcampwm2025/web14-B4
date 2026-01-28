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

        <ul className="grid grid-cols-1 gap-4">
          {questions.map((question, idx) => (
            <li
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 transition-all duration-500 hover:border-blue-100 hover:bg-slate-50/50 hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.1)] cursor-default"
            >
              <div className="flex items-center gap-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  {idx + 1}
                </span>

                <p className="text-md font-medium text-slate-700 transition-all duration-200 group-hover:text-blue-700 group-hover:font-bold">
                  {question}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
