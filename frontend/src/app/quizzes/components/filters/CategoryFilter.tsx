'use client';

import { useState, useRef, useEffect } from 'react';
import { CategoryCountsResponseDto } from '../../types/quiz';
import { FilterLink } from './FilterLink';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/mainQuiz/window/useWindowSize';

interface CategoryFilterProps {
  categoriesData?: CategoryCountsResponseDto;
  category?: string;
  difficulty?: string;
}

const DIFFICULT_COMPONENT_WIDTH = 300;
const CATEGORY_BUTTON_WIDTH = 200;

export default function CategoryFilter({
  categoriesData,
  category,
  difficulty,
}: CategoryFilterProps) {
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCompact =
    width <
    DIFFICULT_COMPONENT_WIDTH + (categoriesData?.categories.length ?? 0) * CATEGORY_BUTTON_WIDTH;

  const currentParams = { category, difficulty };
  const activeCategory = category || '전체';

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getButtonStyle = (target: string) =>
    cn(
      'flex items-center gap-2 px-4 py-2 rounded-lg text-lg transition-all duration-200 whitespace-nowrap',
      (target === '전체' ? !category : category === target)
        ? 'bg-blue-500 text-white font-bold'
        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100',
    );

  const getCountStyle = (target: string) =>
    cn(
      'flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs ml-auto',
      (target === '전체' ? !category : category === target)
        ? 'bg-white text-blue-500'
        : 'bg-gray-100 text-gray-500',
    );

  const categories = [
    { id: 0, name: '전체', count: categoriesData?.totalCount || 0 },
    ...(categoriesData?.categories || []),
  ];

  return (
    <div className="flex flex-col min-w-[200px] items-end">
      <div className="mb-1 right text-xl font-semibold">분야</div>
      <div className="mb-7">
        {isCompact ? (
          // 드롭다운
          <div className="relative w-45" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full px-4 py-2 bg-white border-2 border-blue-500 rounded-lg text-lg font-medium text-blue-600 cursor-pointer"
            >
              <span>{activeCategory}</span>
              <span
                className="ml-2 transform transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <FilterLink
                    key={cat.id}
                    param="category"
                    value={cat.name}
                    currentParams={currentParams}
                    className="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors border-b last:border-none"
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={cn(
                        'text-base',
                        activeCategory === cat.name ? 'text-blue-600 font-bold' : 'text-gray-700',
                      )}
                    >
                      {cat.name}
                    </span>
                    <span className={getCountStyle(cat.name)}>{cat.count}</span>
                  </FilterLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          // 화면 너비가 충분하여 버튼 나열 상태일 때,
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
