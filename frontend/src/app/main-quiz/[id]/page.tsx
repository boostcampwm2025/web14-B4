import AudioRecorder from '@/app/main-quiz/[id]/components/AudioRecorder';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MainQuizPage({ params }: PageProps) {
  const { id } = await params;
  const quizId = Number(id);

  return (
    <main>
      <AudioRecorder quizId={quizId} />
    </main>
  );
}
