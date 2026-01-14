import { FilterLink } from './FilterLink';

interface DifficultyFilterProps {
  difficulty?: string;
  /** 현재 선택된 카테고리 (쿼리 유지용) */
  category?: string;
}

interface DifficultyFilterProps {
  difficulty?: string;
  category?: string;
}

const LEVEL_ALL = '전체';

const DIFFICULTY_LEVELS = [LEVEL_ALL, '상', '중', '하'] as const;

const DIFFICULTY_COLOR_CLASS: Record<string, string> = {
  상: 'bg-[var(--color-difficulty-high-bg)] text-[var(--color-difficulty-high-text)]',
  중: 'bg-[var(--color-difficulty-mid-bg)] text-[var(--color-difficulty-mid-text)]',
  하: 'bg-[var(--color-difficulty-low-bg)] text-[var(--color-difficulty-low-text)]',
};

const BUTTON_BASE_CLASS = 'px-3 py-2 rounded-full text-lg transition';
const BUTTON_ACTIVE_CLASS = 'font-bold';
const BUTTON_ACTIVE_ALL_CLASS = 'bg-blue-500 text-white font-bold';
const BUTTON_INACTIVE_CLASS =
  'bg-[var(--color-gray-light)] text-[var(--color-gray-dark)] hover:bg-gray-200';

interface DifficultyFilterProps {
  difficulty?: string;
  category?: string;
}

export default function DifficultyFilter({ difficulty, category }: DifficultyFilterProps) {
  const isActive = (level: string) => {
    if (level === LEVEL_ALL) return difficulty === undefined;
    return difficulty === level;
  };

  // 활성화 / 레벨 별 버튼 스타일
  const getButtonClassName = (level: string) => {
    if (!isActive(level)) return ` ${BUTTON_INACTIVE_CLASS}`;
    if (level === LEVEL_ALL) return ` ${BUTTON_ACTIVE_ALL_CLASS}`;
    return `${DIFFICULTY_COLOR_CLASS[level]} ${BUTTON_ACTIVE_CLASS}`;
  };

  const currentParams = { category, difficulty };

  return (
    <div className="flex flex-col">
      <div className="mb-3 text-xl font-semibold">난이도</div>

      <div className="flex gap-2 mb-8">
        {DIFFICULTY_LEVELS.map((level) => (
          <FilterLink
            key={level}
            param="difficulty"
            value={level}
            currentParams={currentParams}
            className={BUTTON_BASE_CLASS + getButtonClassName(level)}
          >
            {level}
          </FilterLink>
        ))}
      </div>
    </div>
  );
}
