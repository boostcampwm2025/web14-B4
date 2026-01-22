// components/ImportanceBadge.tsx
'use client';

import { Category } from '@/types/category.types';
import { ImportanceItem } from '../../types/importanceItem';
import { CATEGORY_STYLE_MAP, DEFAULT_CATEGORY_STYLE } from '@/services/mapper/categoryMapper';
import { Tooltip } from './Tooltip';

interface ImportanceBadgeProps {
  item: ImportanceItem;
}
export function ImportanceBadge({ item }: ImportanceBadgeProps) {
  const style = CATEGORY_STYLE_MAP[item.category as Category] ?? DEFAULT_CATEGORY_STYLE;

  return (
    <div className="relative group max-w-full">
      <button
        type="button"
        className={`
          inline-flex max-w-full items-center rounded-full border-3 px-4 py-1.5 text-sm font-medium
          transition-all duration-200
          ${style.bg} ${style.border} ${style.text}
          cursor-pointer
          group-hover:-translate-y-1 group-hover:shadow-md
        `}
      >
        <span className="truncate">{item.category}</span>
      </button>

      <Tooltip title={item.category} description={item.mainQuizTitle} />
    </div>
  );
}
