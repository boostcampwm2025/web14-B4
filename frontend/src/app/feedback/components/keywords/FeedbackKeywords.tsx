'use client';

import { useState } from 'react';
import KeywordButton, { Keyword } from './KeywordButton';

type Props = {
  keywords: Keyword[];
  defaultFeedback: string;
};

export default function FeedbackKeywords({ keywords, defaultFeedback }: Props) {
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [hoveredKeyword, setHoveredKeyword] = useState<Keyword | null>(null);

  // hover가 우선순위, 없으면 selected, 둘 다 없으면 null
  const displayedKeyword = hoveredKeyword || selectedKeyword;

  const handleKeywordClick = (keyword: Keyword) => {
    // 같은 키워드 재클릭 시 선택 해제
    setSelectedKeyword((prev) => (prev === keyword ? null : keyword));
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-lg font-bold text-[var(--color-accent-navy)] mb-4 flex items-center gap-2">
          <span>🔠</span> 핵심 키워드
        </h2>
        <div className="flex flex-col items-center md:flex-row">
          <div className="flex-1 flex justify-center flex-wrap gap-3 content-start">
            {keywords.map((keyword, idx) => (
              <KeywordButton
                key={idx}
                keyword={keyword}
                isSelected={selectedKeyword === keyword}
                onClick={() => handleKeywordClick(keyword)}
                onMouseEnter={() => setHoveredKeyword(keyword)}
                onMouseLeave={() => setHoveredKeyword(null)}
              />
            ))}
          </div>

          <div className="flex-1 flex space-between pl-3">
            <div className="shrink-0 w-[3px] bg-[var(--color-accent-sky)] mr-4 h-[140px] rounded-full" />
            <div className="text-sm text-[var(--color-gray-dark)] leading-relaxed whitespace-pre-wrap">
              {displayedKeyword ? (
                <>
                  <div className="text-base font-bold">{displayedKeyword.text}(이)란?</div>
                  {displayedKeyword.description}
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
