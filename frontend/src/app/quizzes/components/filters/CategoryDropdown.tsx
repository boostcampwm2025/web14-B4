'use client';

import { useState, useRef, useEffect } from 'react';
import { FilterLink } from './FilterLink';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  count: number;
}

interface CategoryDropdownProps {
  categories: Category[];
  activeCategory: string;
  currentParams: { category?: string; difficulty?: string };
}

export default function CategoryDropdown({
  categories,
  activeCategory,
  currentParams,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCountStyle = (target: string) =>
    cn(
      'flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs ml-auto',
      target === activeCategory
        ? 'bg-white text-[var(--color-primary)]'
        : 'bg-gray-100 text-gray-500',
    );

  return (
    <div className="relative w-45" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border-2 border-[var(--color-primary)] rounded-lg text-lg font-medium text-[var(--color-primary)] cursor-pointer"
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
        <div className="absolute z-50 w-full mt-2 items-center bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {categories.map((cat) => (
            <FilterLink
              key={cat.id}
              param="category"
              value={cat.name}
              currentParams={currentParams}
              className="flex items-center hover:bg-[var(--color-accent-sky)] transition-colors border-b last:border-none"
            >
              <div
                className="w-full h-full flex items-center py-3 px-4"
                onClick={() => setIsOpen(false)}
              >
                <span
                  className={cn(
                    'text-base',
                    activeCategory === cat.name
                      ? 'text-[var(--color-primary)] font-bold'
                      : 'text-gray-700',
                  )}
                >
                  {cat.name}
                </span>
                <span className={getCountStyle(cat.name)}>{cat.count}</span>
              </div>
            </FilterLink>
          ))}
        </div>
      )}
    </div>
  );
}
