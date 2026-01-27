import { Category } from '@/types/category.types';

export type CategoryStyle = {
  bg: string;
  border: string;
  text: string;
};

export const CATEGORY_STYLE_MAP: Record<Category, CategoryStyle> = {
  [Category.COMPUTER_STRUCTURE]: {
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    text: 'text-amber-700',
  },
  [Category.NETWORK]: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    text: 'text-blue-700',
  },
  [Category.OS]: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-700',
  },
  [Category.DATABASE]: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    text: 'text-emerald-700',
  },
};

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  bg: 'bg-slate-100',
  border: 'border-slate-400',
  text: 'text-slate-600',
};
