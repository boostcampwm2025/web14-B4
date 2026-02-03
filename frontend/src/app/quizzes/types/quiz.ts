export const DIFFICULTY_MAP = {
  상: true,
  중: true,
  하: true,
} as const;

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

// 페이지네이션 메타데이터
export interface PaginationMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
  limit: number;
}

// 퀴즈 목록 응답 데이터
export interface QuizListData {
  data: Quiz[];
  meta: PaginationMeta;
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
