import { fetchAIFeedbackResult } from '@/services/apis/feedbackApi';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import FeedbackHeader from '@/app/feedback/components/FeedbackHeader';
import FeedbackKeywords from '../../../../components/keywords/FeedbackKeywords';
import FeedbackQuestions from '@/app/feedback/components/FeedbackQuestions';
import FeedbackComplements from '@/app/feedback/components/complements/FeedbackComplements';
import ImportanceCheck from '@/app/feedback/components/ImportanceCheck';
import PreventBackNavigation from '@/components/PreventBackNavigation';
import { ApiError } from '@/services/http/errors';

type Props = {
  params: Promise<{
    mainQuizId: string;
    solvedQuizId: string;
  }>;
};

export default async function FeedbackPage({ params }: Props) {
  const { solvedQuizId } = await params;

  // 쿠키에서 username 가져오기
  const cookieStore = await cookies();
  const usernameCookie = cookieStore.get('username')?.value;
  const username = usernameCookie ? decodeURIComponent(usernameCookie) : '게스트';

  let data;
  try {
    data = await fetchAIFeedbackResult(Number(solvedQuizId));
  } catch (error) {
    if (error instanceof ApiError && error.status === 403) {
      redirect('/quizzes?error=access_denied');
    }
    redirect('/quizzes?error=not_found');
  }
  const { solvedQuizDetail, aiFeedbackResult } = data;

  const mergedKeywords = solvedQuizDetail.keywords.map((k) => ({
    text: k.keyword,
    description: k.description,
    isIncluded: aiFeedbackResult.includedKeywords.some(
      (ik) => ik.keyword === k.keyword && ik.isIncluded,
    ),
  }));

  return (
    <main className="flex flex-col justify-center m-5">
      <PreventBackNavigation />
      <FeedbackHeader
        content={solvedQuizDetail.content}
        category={solvedQuizDetail.quizCategory.name}
        difficultyLevel={solvedQuizDetail.difficultyLevel}
        userName={username}
        checklistCount={solvedQuizDetail.userChecklistProgress.checklistCount}
        checkedCount={solvedQuizDetail.userChecklistProgress.checkedCount}
      />
      <FeedbackKeywords
        userName={username}
        keywords={mergedKeywords}
        defaultFeedback={aiFeedbackResult.keywordsFeedback}
      />
      <FeedbackComplements items={aiFeedbackResult.complementsFeedback} />
      <FeedbackQuestions questions={aiFeedbackResult.followUpQuestions} />
      <ImportanceCheck
        userName={username}
        mainQuizId={solvedQuizDetail.mainQuizId}
        solvedQuizId={Number(solvedQuizId)}
        importance={solvedQuizDetail.importance}
      />
    </main>
  );
}
