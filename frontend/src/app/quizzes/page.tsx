import { Suspense } from 'react';
import { fetchAllQuizzes, fetchQuizzes } from '@/services/apis/quizApi';
import { cookies } from 'next/headers';
import QuizPageClient from './components/QuizPageClient';
import BackToTopButton from './components/BackToTopButton';

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
      <BackToTopButton />
    </>
  );
}
