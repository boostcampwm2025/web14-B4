import { Quiz, CategoryCountsResponseDto, DIFFICULTY_MAP } from '../types/quiz';

/**
 * 서버에서 퀴즈를 필터링합니다.
 */
export function filterQuizzesByParams(
  quizzes: Quiz[],
  category?: string,
  difficulty?: string,
): Quiz[] {
  let filtered = quizzes;

  // 카테고리 필터링
  if (category) {
    filtered = filtered.filter((quiz) => quiz.quizCategory.name === category);
  }

  // 난이도 필터링
  if (difficulty && difficulty in DIFFICULTY_MAP) {
    filtered = filtered.filter((quiz) => quiz.difficultyLevel === difficulty);
  }

  return filtered;
}

/**
 * 서버에서 카테고리별 퀴즈 개수를 계산합니다.
 */
export function calculateCategoryCounts(
  quizzes: Quiz[],
  difficulty?: string,
): CategoryCountsResponseDto {
  // 난이도 필터링 먼저 적용
  let filteredQuizzes = quizzes;
  if (difficulty && difficulty in DIFFICULTY_MAP) {
    filteredQuizzes = quizzes.filter((quiz) => quiz.difficultyLevel === difficulty);
  }

  // 카테고리별 카운트 계산
  const categoryMap = new Map<
    number,
    { quizCategoryId: number; id: number; name: string; count: number }
  >();

  filteredQuizzes.forEach((quiz) => {
    const { quizCategoryId, name } = quiz.quizCategory;

    if (categoryMap.has(quizCategoryId)) {
      categoryMap.get(quizCategoryId)!.count++;
    } else {
      categoryMap.set(quizCategoryId, {
        quizCategoryId,
        id: quizCategoryId,
        name,
        count: 1,
      });
    }
  });

  return {
    totalCount: filteredQuizzes.length,
    categories: Array.from(categoryMap.values()),
  };
}
