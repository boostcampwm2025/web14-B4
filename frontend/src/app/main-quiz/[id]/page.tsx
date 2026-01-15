import AudioRecorder from '@/app/main-quiz/[id]/components/AudioRecorder';
import { fetchQuiz } from '@/services/quizApi';
import { Chip } from '@/components/Chip';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MainQuizPage({ params }: PageProps) {
  const { id } = await params;
  const quizId = Number(id);

  const quiz = await fetchQuiz(quizId);

  return (
    <main>
      <div className="flex justify-center pt-10">
        <Chip variant="primary" className="p-0 flex items-center divide-x divide-white">
          <span className="px-3 text-base font-medium">{quiz.quizCategory.name}</span>
          <span className="px-3 text-base font-medium flex items-center gap-2">
            난이도
            <span className="px-2 py-1 text-base font-medium bg-white text-[var(--color-primary)] rounded-full">
              {quiz.difficultyLevel}
            </span>
          </span>
        </Chip>
      </div>
      <div className="flex justify-center pt-10">
        <h1 className="flex justify-center text-2xl font-semibold">{quiz.content}</h1>
      </div>
      <AudioRecorder quizId={quizId} />
    </main>
  );
}
