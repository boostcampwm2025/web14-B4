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

  const displayedKeyword = hoveredKeyword || selectedKeyword;

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100">
        {/* 상단 제목 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-1 pb-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-[var(--color-accent-navy)] flex items-center gap-2 line-1">
            <span className="text-xl/9">🔠</span> 핵심 키워드 분석
            {selectedKeyword && (
              <button
                onClick={() => setSelectedKeyword(null)}
                className="flex items-center gap-2 ml-5 px-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 animate-fadeIn text-center align-middle py-1
                cursor-pointer"
              >
                <span className="text-base">✨</span> AI 피드백 다시보기
              </button>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 flex flex-wrap gap-3 content-start">
            <p className="w-full text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Keywords 클릭 시, 설명을 확인할 수 있어요
            </p>
            {keywords.map((keyword, idx) => (
              <KeywordButton
                key={idx}
                keyword={keyword}
                isSelected={selectedKeyword === keyword}
                onClick={() => setSelectedKeyword((prev) => (prev === keyword ? null : keyword))}
                onMouseEnter={() => setHoveredKeyword(keyword)}
                onMouseLeave={() => setHoveredKeyword(null)}
              />
            ))}
          </div>

          {/* 오른쪽: 피드백 및 설명 영역 */}
          <div className="lg:col-span-7 relative">
            <div className="h-full min-h-[100px] p-6 rounded-xl bg-gray-50 border border-gray-200 shadow-sm relative overflow-hidden">
              <div
                className={`absolute left-0 top-0 w-1.5 h-full transition-colors duration-300 ${displayedKeyword ? 'bg-blue-500' : 'bg-indigo-500'}`}
              />

              <div className="relative z-10">
                {displayedKeyword ? (
                  <div className="animate-slideIn">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                        Keyword
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {displayedKeyword.text}(이)란?
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {displayedKeyword.description}
                    </p>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                        AI Feedback
                      </span>
                      <h3 className="text-lg font-bold text-indigo-900">종합 분석 피드백</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {defaultFeedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
