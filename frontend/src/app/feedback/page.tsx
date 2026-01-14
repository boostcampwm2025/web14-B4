import ImportanceCheck from '@/app/feedback/components/ImportanceCheck';

export default function FeedbackPage() {
  // TODO: AI 피드백 연동 후 하드코딩 제거
  const mainQuizId = 1;
  const solvedQuizId = 1;

  return (
    <main>
      <ImportanceCheck mainQuizId={mainQuizId} solvedQuizId={solvedQuizId} />
    </main>
  );
}
