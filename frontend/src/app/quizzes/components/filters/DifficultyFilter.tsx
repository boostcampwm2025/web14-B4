import { FilterLink } from './FilterLink';
import {
  LEVEL_ALL,
  DIFFICULTY_LEVELS,
  DIFFICULTY_COLOR_CLASS,
  BUTTON_STYLES,
} from '@/constants/quizzes.constant';

interface DifficultyFilterProps {
  difficulty?: string;
  category?: string;
}

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
                ${BUTTON_STYLES.BASE}
                ${
                  active
                    ? `${DIFFICULTY_COLOR_CLASS[level]} font-bold scale-105`
                    : BUTTON_STYLES.INACTIVE
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
