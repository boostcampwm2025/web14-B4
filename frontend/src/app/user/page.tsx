export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
import { getUserComprehensions, getUserSolvedStatistics } from '@/services/apis/usersApi';
import QuizStatisticsSection from './components/QuizStatisticsSection';
import MyProfile, { mockUserData } from './components/MyProfile';
import ImportanceBoard from './components/importanceGroup/ImportanceBoard';

export default async function Page() {
  const cookieStore = await cookies();
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
