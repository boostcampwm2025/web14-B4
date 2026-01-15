import { getAIFeedBack } from '@/services/feedbackApi';
import FeedbackHeader from '@/app/feedback/components/FeedbackHeader';
import FeedbackKeywords from '@/app/feedback/components/FeedbackKeywords';
import ImportanceCheck from '@/app/feedback/components/ImportanceCheck';
import FeedbackQuestions from '@/app/feedback/components/FeedbackQuestions';

type Props = {
  params: Promise<{
    mainQuizId: string;
    solvedQuizId: string;
  }>;
};

export default async function FeedbackPage({ params }: Props) {
  const { mainQuizId, solvedQuizId } = await params;
  const numericMainQuizId = Number(mainQuizId);
  const numericSolvedQuizId = Number(solvedQuizId);

  const { solvedQuizDetail, aiFeedbackResult } = await getAIFeedBack({
    mainQuizId: numericMainQuizId,
    solvedQuizId: numericSolvedQuizId,
  });

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
      <FeedbackQuestions questions={aiFeedbackResult.followUpQuestions} />
      <ImportanceCheck
        userName={USER_NAME}
        mainQuizId={Number(mainQuizId)}
        solvedQuizId={Number(solvedQuizId)}
      />
    </main>
  );
}
