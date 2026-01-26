import { getUserComprehensions, getUserSolvedStatistics } from '@/services/apis/usersApi';
import QuizStatisticsSection from './components/QuizStatisticsSection';

export default async function Page() {
  // 서버에서 한 번만 데이터 페치
  const [comprehensionResponse, solvedQuizResponse] = await Promise.all([
    getUserComprehensions(),
    getUserSolvedStatistics(),
  ]);

  return (
    <QuizStatisticsSection
      comprehensionData={comprehensionResponse.comprehensionData}
      solvedData={solvedQuizResponse.solvedData}
    />
  );
}
