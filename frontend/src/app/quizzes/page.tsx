import { Suspense } from 'react';
import QuizPageServer from './components/QuizPageServer';
import ErrorToast from './components/ErrorToast';
import { fetchAllQuizzes } from '@/services/apis/quizApi';
import { filterQuizzesByParams, calculateCategoryCounts } from './utils/serverFilters';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const { category, difficulty } = params;

  // 1. 전체 퀴즈 데이터 fetch (캐시 1시간)
  const allQuizzes = await fetchAllQuizzes();

  // 2. 서버에서 필터링
  const filteredQuizzes = filterQuizzesByParams(allQuizzes, category, difficulty);

  // 3. 서버에서 카테고리 카운트 계산
  const categoryCounts = calculateCategoryCounts(allQuizzes, difficulty);

  return (
    <>
      <ErrorToast />
      <Suspense fallback={null}>
        <QuizPageServer
          quizzes={filteredQuizzes}
          categories={categoryCounts}
          category={category}
          difficulty={difficulty}
        />
      </Suspense>
    </>
  );
}
