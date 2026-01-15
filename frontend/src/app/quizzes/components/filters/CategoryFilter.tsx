import { FilterLink } from './FilterLink';

interface Category {
  id: number;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  totalCount: number;
  /** 현재 선택된 카테고리 */
  category?: string;
  /** 현재 선택된 난이도 (쿼리 유지용) */
  difficulty?: string;
}

export default function CategoryFilter({
  categories,
  totalCount,
  category,
  difficulty,
}: CategoryFilterProps) {
  const isActive = (target: string) => (target === '전체' ? !category : category === target);

  const getButtonStyle = (target: string) =>
    isActive(target)
      ? 'flex items-center gap-2 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-lg'
      : 'flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg text-lg hover:bg-gray-200';

  const getCountStyle = (target: string) =>
    isActive(target) ? 'bg-white text-black' : 'bg-[var(--color-gray-light)] text-black';

  const currentParams = { category, difficulty };

  return (
    <div className="flex flex-col">
      <div className="mb-3 text-xl font-semibold">분야</div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {/* 전체 */}
        <FilterLink
          param="category"
          value="전체"
          currentParams={currentParams}
          className={getButtonStyle('전체')}
        >
          <span>전체</span>
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full text-sm ${getCountStyle(
              '전체',
            )}`}
          >
            {totalCount}
          </span>
        </FilterLink>

        {/* 개별 카테고리 */}
        {categories.map((cat) => (
          <FilterLink
            key={cat.id}
            param="category"
            value={cat.name}
            currentParams={currentParams}
            className={getButtonStyle(cat.name)}
          >
            <span>{cat.name}</span>
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full text-sm ${getCountStyle(
                cat.name,
              )}`}
            >
              {cat.count}
            </span>
          </FilterLink>
        ))}
      </div>
    </div>
  );
}
