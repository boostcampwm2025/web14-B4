import { fetchAIFeedbackResult } from '@/services/feedbackApi';
import FeedbackHeader from '@/app/feedback/components/FeedbackHeader';
import FeedbackKeywords from '../../../../components/FeedbackKeywords';
import ImportanceCheck from '@/app/feedback/components/ImportanceCheck';

type Props = {
  params: Promise<{
    mainQuizId: string;
    solvedQuizId: string;
  }>;
};

export default async function FeedbackPage({ params }: Props) {
  const { mainQuizId, solvedQuizId } = await params;
  const { solvedQuizDetail, aiFeedbackResult } = await fetchAIFeedbackResult(Number(solvedQuizId));

  const mergedKeywords = solvedQuizDetail.keywords.map((k) => ({
    text: k.keyword,
    isIncluded: aiFeedbackResult.includedKeywords.some(
      (ik) => ik.keyword === k.keyword && ik.isIncluded,
    ),
  }));

  const USER_NAME = '철수';

  return (
    <main className="flex flex-col justify-center m-5">
      <FeedbackHeader
        content={solvedQuizDetail.content}
        category={solvedQuizDetail.quizCategory.name}
        difficultyLevel={solvedQuizDetail.difficultyLevel}
        userName={USER_NAME}
        checklistCount={solvedQuizDetail.userChecklistProgress.checklistCount}
        checkedCount={solvedQuizDetail.userChecklistProgress.checkedCount}
      />
      <FeedbackKeywords
        keywords={mergedKeywords}
        defaultFeedback={aiFeedbackResult.keywordsFeedback}
      />
      <ImportanceCheck
        userName={USER_NAME}
        mainQuizId={Number(mainQuizId)}
        solvedQuizId={Number(solvedQuizId)}
      />
    </main>
  );
}
