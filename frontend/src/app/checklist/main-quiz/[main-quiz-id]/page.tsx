import { fetchQuiz, fetchQuizChecklistItems } from '@/services/apis/quizApi';
import { getSpeechesByQuizId } from '@/services/apis/speechesApi';
import { QuizInfoBadge } from '@/components/QuizInfoBadge';
import ChecklistSection from '../../components/ChecklistSection';

export default async function ResultPage({
  params,
}: {
  params: Promise<{ 'main-quiz-id': string }>;
}) {
  const resolvedParams = await params;
  const mainQuizId = parseInt(resolvedParams['main-quiz-id'], 10);

  const quiz = await fetchQuiz(mainQuizId);
  // 서버에서 모든 데이터 병렬로 fetching
  const [checklistData, speechData] = await Promise.all([
    fetchQuizChecklistItems(mainQuizId),
    getSpeechesByQuizId(mainQuizId),
  ]);

  // 초기 데이터 가공
  const initialChecklistItems =
    checklistData?.checklistItems?.map((item) => ({
      id: item.checklistItemId,
      content: item.content,
      checked: false,
    })) || [];

  const LATEST = 0;
  const initialSpeechItem = speechData.speeches?.[LATEST] || {
    solvedQuizId: -1,
    speechText: '답변이 전송되지 않았습니다.',
    createdAt: null,
  };

  return (
    <main>
      <div className="flex justify-center pt-10">
        <QuizInfoBadge
          quizCategoryName={quiz.quizCategory.name}
          difficultyLevel={quiz.difficultyLevel}
        />
      </div>
      <div className="flex justify-center pt-10">
        <h1 className="flex justify-center text-2xl font-semibold">{quiz.content}</h1>
      </div>
      {/* 상호작용 필요한 부분 - 클라이언트 컴포넌트 */}
      <ChecklistSection
        mainQuizId={mainQuizId}
        initialSpeechItem={initialSpeechItem}
        initialChecklistItems={initialChecklistItems}
      />
    </main>
  );
}
