export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserComprehensions, getUserSolvedStatistics } from '@/services/apis/usersApi';
import QuizStatisticsSection from './components/QuizStatisticsSection';
import MyProfile, { mockUserData } from './components/MyProfile';
import ImportanceBoard from './components/importanceGroup/ImportanceBoard';

export default async function Page() {
  const cookieStore = await cookies();
  // accessToken이 없으면 로그인 페이지로 리다이렉트
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    redirect('/quizzes?authRequired=true');
  }

  const username = cookieStore.get('username')?.value || '사용자';

  const [comprehensionResponse, solvedQuizResponse] = await Promise.all([
    getUserComprehensions(),
    getUserSolvedStatistics(),
  ]);

  const userData = {
    ...mockUserData,
    name: username,
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <div className="space-y-3">
        <MyProfile user={userData} />
        <QuizStatisticsSection
          comprehensionData={comprehensionResponse.comprehensionData}
          solvedData={solvedQuizResponse.solvedData}
        />
        <ImportanceBoard />
      </div>
    </div>
  );
}
