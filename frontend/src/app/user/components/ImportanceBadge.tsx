// components/ImportanceBadge.tsx
'use client';

import { Category } from '@/types/category.types';
import { ImportanceItem } from '../types/importanceItem';
import { CATEGORY_STYLE_MAP, DEFAULT_CATEGORY_STYLE } from '@/services/mapper/categoryMapper';

interface ImportanceBadgeProps {
  item: ImportanceItem;
}

export function ImportanceBadge({ item }: ImportanceBadgeProps) {
  const style = CATEGORY_STYLE_MAP[item.category as Category] ?? DEFAULT_CATEGORY_STYLE;

  return (
    <button
      type="button"
      className={`inline-flex max-w-full items-center rounded-full border-3 px-4 py-1.5 text-sm font-medium
        ${style.bg} ${style.border} ${style.text}
        cursor-pointer`}
    >
      <span className="truncate">{item.category}</span>
    </button>
  );
}
