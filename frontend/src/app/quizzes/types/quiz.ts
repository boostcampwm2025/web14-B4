export type Difficulty = '상' | '중' | '하';

export interface QuizCategory {
  id: number;
  name: string;
}

export interface Quiz {
  id: number;
  title: string;
  content: string;
  hint: string | null;
  difficulty: Difficulty;
  category: QuizCategory;
}

export interface QuizCategoryWithCount extends QuizCategory {
  count: number;
}
export interface CategoryCountsResponseDto {
  totalCount: number;
  categories: QuizCategoryWithCount[];
}
