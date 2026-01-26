'use client';

export type Keyword = {
  text: string;
  isIncluded: boolean;
  description: string;
};

type KeywordButtonProps = {
  keyword: Keyword;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function KeywordButton({ keyword, onMouseEnter, onMouseLeave }: KeywordButtonProps) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
  );
}
