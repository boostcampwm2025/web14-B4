'use client';

import { useState } from 'react';

type Props = {
  userName: string;
  speechText: string;
};

export default function FeedbackMyAnswer({ userName, speechText }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] mb-5">
        <div
          className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
            isExpanded
              ? 'bg-blue-50/40 border-blue-200 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.1)]'
              : 'bg-white border-slate-100'
          }`}
        >
          {/* 헤더 영역 */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex w-full items-center justify-between p-6 sm:px-8 text-left cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                  isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>

              <div>
                <h2
                  className={`text-lg font-bold transition-colors ${isExpanded ? 'text-[var(--color-accent-navy)]' : 'text-black'}`}
                >
                  {userName}님의 답변 되돌아보기
                </h2>
                <p className="text-xs text-[var(--color-gray-dark)] mt-1">
                  답변을 복기하며 메타인지를 높여보세요
                </p>
              </div>
            </div>

            <div
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>

          {/* 답변 내용 영역 */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 pb-8">
                <div className="relative rounded-2xl bg-white p-6 border border-blue-200 shadow-inner">
                  <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-blue-600" />

                  <div>
                    <p className="pl-4 text-[15px] leading-8 text-slate-700 whitespace-pre-wrap break-all font-medium">
                      {speechText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
