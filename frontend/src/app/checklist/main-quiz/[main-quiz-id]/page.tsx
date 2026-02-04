import { fetchQuiz, fetchQuizChecklistItems } from '@/services/apis/quizApi';
import { getSpeechesByQuizId } from '@/services/apis/speechesApi';
import { QuizInfoBadge } from '@/components/QuizInfoBadge';
import ChecklistSection from '../../components/ChecklistSection';
import { cookies } from 'next/headers';

export default async function ResultPage({
  params,
}: {
  params: Promise<{ 'main-quiz-id': string }>;
}) {
  const resolvedParams = await params;
  const mainQuizId = parseInt(resolvedParams['main-quiz-id'], 10);

  // 쿠키에서 username 가져오기
  const cookieStore = await cookies();
  const usernameCookie = cookieStore.get('username')?.value;
  const username = usernameCookie ? decodeURIComponent(usernameCookie) : '게스트';

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
      <div className="flex justify-center pt-10 pb-4">
        <QuizInfoBadge
          quizCategoryName={quiz.quizCategory.name}
          difficultyLevel={quiz.difficultyLevel}
        />
      </div>
      <div className="flex justify-center px-10">
        <h1
          className="max-w-[900px] text-2xl font-semibold text-center leading-relaxed break-keep tracking-tight"
          style={{ wordBreak: 'keep-all' }} // 단어가 잘리지 않게 설정
        >
          {quiz.content}
        </h1>
      </div>
      {/* 상호작용 필요한 부분 - 클라이언트 컴포넌트 */}
      <ChecklistSection
        mainQuizId={mainQuizId}
        username={username}
        initialSpeechItem={initialSpeechItem}
        initialChecklistItems={initialChecklistItems}
      />
    </main>
  );
}
