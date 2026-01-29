'use client';

import { useState } from 'react';
import ComplementItem from './ComplementItem';

type ComplementItem = {
  title: string;
  content: string;
};

export default function FeedbackComplement({ items }: { items: ComplementItem[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl">
              🌱
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              나의 답변에서 <span className="text-(--color-accent-navy)">보완해볼 포인트</span>
            </h2>
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <ComplementItem
              key={idx}
              item={item}
              idx={idx}
              isExpanded={activeIdx === idx}
              onToggle={() => setActiveIdx(activeIdx === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
