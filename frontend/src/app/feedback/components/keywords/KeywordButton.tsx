'use client';

export type Keyword = {
  text: string;
  isIncluded: boolean;
  description: string;
};

type KeywordButtonProps = {
  keyword: Keyword;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function KeywordButton({
  keyword,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: KeywordButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group relative px-4 py-2 rounded-full text-md font-semibold transition-all duration-200 border-2
        cursor-pointer hover:scale-105 active:scale-95
        ${
          keyword.isIncluded
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
            : 'bg-gray-50 text-gray-400 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100'
        }
        ${
          isSelected
            ? 'ring-4 ring-offset-2 ring-[var(--color-primary)] ring-opacity-50' // 선택된 상태 강조
            : 'opacity-90 hover:opacity-100'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span>{keyword.isIncluded ? '✓' : '✕'}</span>

        <span>{keyword.text}</span>
        {isSelected && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
        )}
      </div>
    </button>
  );
}
