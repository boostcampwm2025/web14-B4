export const dynamic = 'force-dynamic';
import { getUserComprehensions, getUserSolvedStatistics } from '@/services/apis/usersApi';
import QuizStatisticsSection from './components/QuizStatisticsSection';
import MyProfile, { mockUserData } from './components/MyProfile';
import ImportanceBoard from './components/importanceGroup/ImportanceBoard'; 

export default async function Page() {
  const [comprehensionResponse, solvedQuizResponse] = await Promise.all([
    getUserComprehensions(),
    getUserSolvedStatistics(),
  ]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <div className="space-y-3">
        <MyProfile user={mockUserData} />
        <QuizStatisticsSection
          comprehensionData={comprehensionResponse.comprehensionData}
          solvedData={solvedQuizResponse.solvedData}
        />
        <ImportanceBoard />
      </div>
    </div>
  );
}
