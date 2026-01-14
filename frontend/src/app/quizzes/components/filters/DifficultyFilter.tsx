import { FilterLink } from './FilterLink';

interface DifficultyFilterProps {
  /** 현재 선택된 난이도 */
  difficulty?: string;

  /** 현재 선택된 카테고리 (쿼리 유지용) */
  category?: string;
}

interface DifficultyFilterProps {
  /** 현재 선택된 난이도 */
  difficulty?: string;

  /** 현재 선택된 카테고리 */
  category?: string;
}

const difficultyStyleMap: Record<string, string> = {
  상: 'bg-[var(--color-difficulty-high-bg)] text-[var(--color-difficulty-high-text)]',
  중: 'bg-[var(--color-difficulty-mid-bg)] text-[var(--color-difficulty-mid-text)]',
  하: 'bg-[var(--color-difficulty-low-bg)] text-[var(--color-difficulty-low-text)]',
};

export default function DifficultyFilter({ difficulty, category }: DifficultyFilterProps) {
  const getButtonStyle = (target: string) => {
    const isActive = target === '전체' ? !difficulty : difficulty === target;

    if (isActive) {
      if (target === '전체') {
        return 'px-3 py-2 bg-blue-500 text-white rounded-full text-lg font-bold';
      }
      return `px-3 py-2 ${difficultyStyleMap[target]} rounded-full text-lg font-bold`;
    }

    return 'px-3 py-2 bg-[var(--color-gray-light)] text-[var(--color-gray-dark)] rounded-full text-lg hover:bg-gray-200';
  };

  const currentParams = { category, difficulty };

  return (
    <div className="flex flex-col">
      <div className="mb-3 text-xl font-semibold">난이도</div>

      <div className="flex gap-2 mb-8">
        {['전체', '상', '중', '하'].map((level) => (
          <FilterLink
            key={level}
            param="difficulty"
            value={level}
            text={level}
            currentParams={currentParams}
            className={getButtonStyle(level)}
          />
        ))}
      </div>
    </div>
  );
}
