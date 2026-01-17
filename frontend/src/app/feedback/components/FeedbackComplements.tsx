type ComplementItem = {
  title: string;
  content: string;
};

export default function FeedbackComplement({ items }: { items: ComplementItem[] }) {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-lg font-bold text-[var(--color-accent-navy)] mb-4 flex items-center gap-2">
          <span>🌱</span> 다음 학습에서 보완해볼 포인트
        </h2>
        <p className="text-sm text-[var(--color-gray-dark))] mb-4 font-medium">
          이 내용들을 함께 설명할 수 있다면, 단순한 구조 설명을 넘어 “왜”를 이해했다고 볼 수
          있습니다.
        </p>

        <ul>
          {items.map((item, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-semibold block mt-5 mb-1">{item.title}</span>
              <div className="border-l-4 border-[var(--color-accent-sky)] pl-4">
                <span className="text-[var(--color-gray-dark))] text-xs">{item.content}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
