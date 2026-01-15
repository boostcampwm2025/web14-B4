export type Difficulty = '상' | '중' | '하';

export interface QuizCategory {
  quizCategoryId: number;
  name: string;
}

export interface Quiz {
  mainQuizId: number;
  title: string;
  content: string;
  hint: string | null;
  difficultyLevel: Difficulty;
  quizCategory: QuizCategory;
}

export interface QuizCategoryWithCount extends QuizCategory {
  id: number;
  name: string;
  count: number;
}
export interface CategoryCountsResponseDto {
  totalCount: number;
  categories: QuizCategoryWithCount[];
}
