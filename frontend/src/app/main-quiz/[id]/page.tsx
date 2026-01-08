import AudioRecorder from '@/app/main-quiz/[id]/components/AudioRecorder';
import { fetchQuiz } from '@/services/quizApi';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MainQuizPage({ params }: PageProps) {
  const { id } = await params;
  const quizId = Number(id);

  const quiz = await fetchQuiz(quizId);

  return (
    <main>
      <h1 className="text-2xl font-semibold">{quiz.content}</h1>
      <AudioRecorder quizId={quizId} />
    </main>
  );
}
