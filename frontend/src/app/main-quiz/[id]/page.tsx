import Recorder from '@/app/main-quiz/[id]/components/Recorder';
import { fetchQuiz } from '@/services/apis/quizApi';
import { QuizInfoBadge } from '@/components/QuizInfoBadge';
import AnswerModeSection from './components/AnswerModeSection';

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
        <QuizInfoBadge
          quizCategoryName={quiz.quizCategory.name}
          difficultyLevel={quiz.difficultyLevel}
        />
      </div>
      <div className="flex justify-center pt-10">
        <h1 className="flex justify-center text-2xl font-semibold">{quiz.content}</h1>
      </div>
      <AnswerModeSection quizId={quizId} />
    </main>
  );
}
