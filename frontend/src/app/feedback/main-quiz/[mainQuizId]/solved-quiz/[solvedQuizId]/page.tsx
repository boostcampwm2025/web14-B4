import ImportanceCheck from '@/app/feedback/components/ImportanceCheck';

type Props = {
  params: Promise<{
    mainQuizId: string;
    solvedQuizId: string;
  }>;
};

export default async function FeedbackPage({ params }: Props) {
  const { mainQuizId, solvedQuizId } = await params;

  return (
    <main>
      <ImportanceCheck mainQuizId={Number(mainQuizId)} solvedQuizId={Number(solvedQuizId)} />
    </main>
  );
}
