import { FilterLink } from './FilterLink';

interface DifficultyFilterProps {
  difficulty?: string;
  category?: string;
}

const LEVEL_ALL = '전체';
const DIFFICULTY_LEVELS = [LEVEL_ALL, '상', '중', '하'] as const;

/** 난이도별 색상 클래스 (활성 상태 전용) */
const DIFFICULTY_COLOR_CLASS: Record<string, string> = {
  상: 'bg-[var(--color-difficulty-high-bg)] text-[var(--color-difficulty-high-text)]',
  중: 'bg-[var(--color-difficulty-mid-bg)] text-[var(--color-difficulty-mid-text)]',
  하: 'bg-[var(--color-difficulty-low-bg)] text-[var(--color-difficulty-low-text)]',
};

const BUTTON_BASE_CLASS = 'px-3 py-2 rounded-full text-lg transition-colors duration-200';
const BUTTON_ACTIVE_COMMON_CLASS = 'font-bold';
const BUTTON_ACTIVE_ALL_CLASS = 'bg-blue-500 text-white';
const BUTTON_ACTIVE_DIFFICULTY_CLASS = 'bg-opacity-100';
const BUTTON_INACTIVE_CLASS =
  'bg-[var(--color-gray-light)] text-[var(--color-gray-dark)] hover:bg-gray-200';

export default function DifficultyFilter({ difficulty, category }: DifficultyFilterProps) {
  /** 해당 난이도가 활성 상태인지 판단 */
  const isActive = (level: string) => {
    if (level === LEVEL_ALL) {
      return difficulty === undefined;
    }
    return difficulty === level;
  };

  /** 버튼 className 결정 */
  const getButtonClassName = (level: string) => {
    if (!isActive(level)) {
      return BUTTON_INACTIVE_CLASS;
    }

    if (level === LEVEL_ALL) {
      return `${BUTTON_ACTIVE_ALL_CLASS} ${BUTTON_ACTIVE_COMMON_CLASS}`;
    }

    return `
      ${DIFFICULTY_COLOR_CLASS[level]}
      ${BUTTON_ACTIVE_DIFFICULTY_CLASS}
      ${BUTTON_ACTIVE_COMMON_CLASS}
    `;
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
            className={`${BUTTON_BASE_CLASS} ${getButtonClassName(level)}`}
          >
            {level}
          </FilterLink>
        ))}
      </div>
    </div>
  );
}
