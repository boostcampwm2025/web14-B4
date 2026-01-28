export default function FeedbackQuestions({ questions }: { questions: string[] }) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl">
              🤔
            </div>
            <h2 className="text-lg font-bold tracking-tight text-(--color-accent-navy)">
              더 생각해볼 질문
            </h2>
          </div>
        </div>

        <ul className="space-y-3">
          {questions.map((question, idx) => (
            <li key={idx} className="flex gap-2 text-sm">
              <span className="text-xs text-[var(--color-accent-sky)] mt-1">●</span>
              {question}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
