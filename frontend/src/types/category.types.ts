// types/category.ts
export enum Category {
  COMPUTER_STRUCTURE = '컴퓨터구조',
  NETWORK = '네트워크',
  OS = '운영체제',
  DATABASE = '데이터베이스',
}

export const CATEGORY_STYLE_MAP: Record<
  Category,
  {
    bg: string;
    border: string;
    text: string;
  }
> = {
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
