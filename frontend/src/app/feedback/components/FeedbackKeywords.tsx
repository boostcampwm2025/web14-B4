'use client';

import { useState } from 'react';

type Keyword = {
  text: string;
  isIncluded: boolean;
  description?: string;
};

type Props = {
  keywords: Keyword[];
  defaultFeedback: string;
};

export default function FeedbackKeywords({ keywords, defaultFeedback }: Props) {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-10 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-lg font-bold text-[var(--color-accent-navy)] mb-4 flex items-center gap-2">
          <span>🔠</span> 핵심 키워드
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex justify-center flex-wrap gap-3 content-start">
            {keywords.map((keyword, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHoveredKeyword(keyword.description || keyword.text)}
                onMouseLeave={() => setHoveredKeyword(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                  ${
                    keyword.isIncluded
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white text-[var(--color-gray-light)] border-[var(--color-gray-light)]'
                  }`}
              >
                {keyword.text}
                {keyword.isIncluded && <span className="ml-1">✓</span>}
              </button>
            ))}
          </div>

          <div className="flex-1 border-t md:border-t-0 md:border-l-4 border-[var(--color-accent-sky)] pt-4 md:pt-0 md:pl-6">
            <p className="text-sm text-gray-700 leading-relaxed animate-fadeIn whitespace-pre-wrap">
              {hoveredKeyword ? hoveredKeyword : defaultFeedback}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
