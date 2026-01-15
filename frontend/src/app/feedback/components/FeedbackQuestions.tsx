export default function FeedbackQuestions({ questions }: { questions: string[] }) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-10 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-lg font-bold text-[var(--color-accent-navy)] mb-4 flex items-center gap-2">
          <span>🤔</span> 더 생각해볼 질문
        </h2>
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
