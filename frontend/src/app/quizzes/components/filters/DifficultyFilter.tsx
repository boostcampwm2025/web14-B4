import { FilterLink } from './FilterLink';

interface DifficultyFilterProps {
  difficulty?: string;
  category?: string;
}

const LEVEL_ALL = '전체';
const DIFFICULTY_LEVELS = [LEVEL_ALL, '상', '중', '하'] as const;

const DIFFICULTY_COLOR_CLASS: Record<string, string> = {
  전체: 'bg-blue-600 text-white shadow-md',
  상: 'bg-rose-500 text-white shadow-md',
  중: 'bg-amber-400 text-white shadow-md',
  하: 'bg-emerald-500 text-white shadow-md',
};

const BUTTON_BASE_CLASS = 'px-6 py-2 rounded-full text-lg transition-all duration-300 ease-out';
const BUTTON_INACTIVE_CLASS =
  'text-[var(--color-gray-dark)] hover:bg-[var(--color-gray-light)] hover:text-gray-700';

export default function DifficultyFilter({ difficulty, category }: DifficultyFilterProps) {
  const currentParams = { category, difficulty };

  const isActive = (level: string) => {
    return level === LEVEL_ALL ? difficulty === undefined : difficulty === level;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 ml-1">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Difficulty</span>
        <div className="h-px flex-1 bg-gray-100"></div>
      </div>

      <div className="inline-flex w-fit p-1.5 bg-gray-100 rounded-full shadow-inner mb-8">
        {DIFFICULTY_LEVELS.map((level) => {
          const active = isActive(level);

          return (
            <FilterLink
              key={level}
              param="difficulty"
              value={level}
              currentParams={currentParams}
              className={`
                ${BUTTON_BASE_CLASS}
                ${
                  active
                    ? `${DIFFICULTY_COLOR_CLASS[level]} font-bold scale-105`
                    : BUTTON_INACTIVE_CLASS
                }
              `}
            >
              {level}
            </FilterLink>
          );
        })}
      </div>
    </div>
  );
}
