import { Suspense } from 'react';
import QuizPageServer from './components/QuizPageServer';
import { fetchAllQuizzes, fetchQuizzes } from '@/services/apis/quizApi';
import { filterQuizzesByParams, calculateCategoryCounts } from './utils/serverFilters';
import { cookies } from 'next/headers';
import QuizPageClient from './components/QuizPageClient';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const { category, difficulty } = params;

  // 쿠키에서 username 가져오기
  const cookieStore = await cookies();
  const usernameCookie = cookieStore.get('username')?.value;
  const username = usernameCookie ? decodeURIComponent(usernameCookie) : '게스트';

  // 1. 전체 퀴즈 데이터 fetch (캐시 1시간)
  const allQuizzes = await fetchAllQuizzes();

  // 2. 서버에서 필터링
  const filteredQuizzes = filterQuizzesByParams(allQuizzes.data, category, difficulty);

  // 3. 서버에서 카테고리 카운트 계산
  const categoryCounts = calculateCategoryCounts(allQuizzes.data, difficulty);

  // 초기 데이터만 로드 (첫 페이지)
  const initialData = await fetchQuizzes({});

  return (
    <>
      <Suspense fallback={null}>
        <QuizPageClient
          initialData={initialData}
          filters={{ category, difficulty }}
          username={username}
        />
      </Suspense>
    </>
  );
}
