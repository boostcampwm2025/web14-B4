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
    <main className="pb-10">
      <div className="flex justify-center pt-10 pb-4">
        <QuizInfoBadge
          size="sm"
          quizCategoryName={quiz.quizCategory.name}
          difficultyLevel={quiz.difficultyLevel}
        />
      </div>

      <div className="flex justify-center px-10 mb-12">
        <h1
          className="max-w-[900px] text-2xl font-semibold text-center leading-relaxed break-keep tracking-tight"
          style={{ wordBreak: 'keep-all' }} // 단어가 잘리지 않게 설정
        >
          {quiz.content}
        </h1>
      </div>

      <AnswerModeSection quizId={quizId} />
    </main>
  );
}
