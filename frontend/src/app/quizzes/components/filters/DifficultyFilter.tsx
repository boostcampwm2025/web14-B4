import { FilterLink } from './FilterLink';

interface DifficultyFilterProps {
  difficulty?: string;
  category?: string;
}

const LEVEL_ALL = '전체';
const DIFFICULTY_LEVELS = [LEVEL_ALL, '상', '중', '하'] as const;

/** * UX 전문가 제안: 각 난이도의 성격에 맞는 컬러 매칭
 * 활성 상태일 때의 배경과 텍스트 색상을 정의합니다.
 */
const DIFFICULTY_COLOR_CLASS: Record<string, string> = {
  전체: 'bg-blue-600 text-white shadow-md', // 중립적인 다크 그레이/블루
  상: 'bg-rose-500 text-white shadow-md', // 경고/도전의 레드
  중: 'bg-amber-400 text-white shadow-md', // 집중의 옐로우/오렌지
  하: 'bg-emerald-500 text-white shadow-md', // 통과/쉬움의 그린
};

const BUTTON_BASE_CLASS = 'px-6 py-2 rounded-full text-lg transition-all duration-300 ease-out';
const BUTTON_INACTIVE_CLASS = 'text-gray-500 hover:bg-gray-200 hover:text-gray-700';

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
