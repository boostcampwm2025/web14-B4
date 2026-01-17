import { getAIFeedBack } from '@/services/feedbackApi';
import FeedbackHeader from '@/app/feedback/components/FeedbackHeader';
import FeedbackKeywords from '../../../../components/FeedbackKeywords';
import FeedbackComplements from '@/app/feedback/components/FeedbackComplements';
import FeedbackQuestions from '@/app/feedback/components/FeedbackQuestions';
import ImportanceCheck from '@/app/feedback/components/ImportanceCheck';

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
    description: k.description,
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
      <FeedbackComplements items={aiFeedbackResult.complementsFeedback} />{' '}
      <FeedbackQuestions questions={aiFeedbackResult.followUpQuestions} />
      <ImportanceCheck
        userName={USER_NAME}
        mainQuizId={Number(mainQuizId)}
        solvedQuizId={Number(solvedQuizId)}
      />
    </main>
  );
}
