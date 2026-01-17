'use client';

import { useState } from 'react';

type Keyword = {
  text: string;
  isIncluded: boolean;
  description: string;
};

type Props = {
  keywords: Keyword[];
  defaultFeedback: string;
};

export default function FeedbackKeywords({ keywords, defaultFeedback }: Props) {
  const [hoveredKeyword, setHoveredKeyword] = useState<Keyword | null>(null);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-lg font-bold text-[var(--color-accent-navy)] mb-4 flex items-center gap-2">
          <span>🔠</span> 핵심 키워드
        </h2>
        <div className="flex flex-col items-center md:flex-row gap-6">
          <div className="flex-1 flex justify-center flex-wrap gap-3 content-start">
            {keywords.map((keyword, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHoveredKeyword(keyword)}
                onMouseLeave={() => setHoveredKeyword(null)}
                className={`px-3 py-2 rounded-full text-md font-semibold transition-all duration-200 border
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

          <div className="flex-1 flex pl-6">
            <div className="shrink-0 w-[3px] bg-[var(--color-accent-sky)] mr-4 h-[140px]" />
            <div className="text-sm text-[var(--color-gray-dark)] leading-relaxed whitespace-pre-wrap">
              {hoveredKeyword ? (
                <>
                  <div className="font-bold mb-1">{hoveredKeyword.text}(이)란?</div>
                  {hoveredKeyword.description}
                </>
              ) : (
                defaultFeedback
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
