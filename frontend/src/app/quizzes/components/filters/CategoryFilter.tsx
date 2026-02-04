'use client';

import { CategoryCountsResponseDto } from '../../types/quiz';
import { FilterLink } from './FilterLink';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/mainQuiz/window/useWindowSize';
import CategoryDropdown from './CategoryDropdown';
import { DEFAULT_CATEGORY, LAYOUT } from '@/constants/quizzes.constant';

interface CategoryFilterProps {
  categoriesData?: CategoryCountsResponseDto;
  category?: string;
  difficulty?: string;
}

export default function CategoryFilter({
  categoriesData,
  category,
  difficulty,
}: CategoryFilterProps) {
  const { width } = useWindowSize();

  const isCompact =
    width <
    LAYOUT.DIFFICULTY_COMPONENT_WIDTH +
      (categories?.length ?? 0) * LAYOUT.CATEGORY_BUTTON_WIDTH * LAYOUT.EXTRA_MARGIN;

  const currentParams = { category, difficulty };
  const activeCategory = category || DEFAULT_CATEGORY;

  const getButtonStyle = (target: string) =>
    cn(
      'flex items-center gap-2 px-4 py-2 rounded-lg text-lg transition-all duration-200 whitespace-nowrap',
      (target === '전체' ? !category : category === target)
        ? 'bg-[var(--color-primary)] text-white font-bold'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-[var(--color-gray-light)]',
    );

  const getCountStyle = (target: string) =>
    cn(
      'flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs ml-auto',
      (target === '전체' ? !category : category === target)
        ? 'bg-white text-[var(--color-primary)]'
        : 'bg-gray-100 text-gray-500',
    );

  const categories = [
    { id: 0, name: DEFAULT_CATEGORY, count: categoriesData?.totalCount || 0 },
    ...(categoriesData?.categories || []),
  ];

  return (
    <div className="flex flex-col min-w-50 items-end gap-4">
      <div className="flex items-center gap-2 ml-1">
        <span className="text-sm font-bold tracking-wider text-gray-400">CATEGORY</span>
        <div className="h-px flex-1 bg-gray-100"></div>
      </div>
      <div className="mb-7">
        {isCompact ? (
          <CategoryDropdown
            categories={categories}
            activeCategory={activeCategory}
            currentParams={currentParams}
          />
        ) : (
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <FilterLink
                key={cat.id}
                param="category"
                value={cat.name}
                currentParams={currentParams}
                className={getButtonStyle(cat.name)}
              >
                <span>{cat.name}</span>
                <span className={getCountStyle(cat.name)}>{cat.count}</span>
              </FilterLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
