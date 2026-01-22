import { fetchMultipleChoices } from '@/services/apis/multipleQuizApi';
import MultipleQuizContainer from './components/multiple-quizzes/MultipleQuizContainer';
import QuizIntro from './components/QuizIntro';

export default async function MultipleQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mainQuizId = Number(id);

  const multipleQuizInfo = await fetchMultipleChoices(mainQuizId);
  return (
    <div className="flex justify-center">
      <div className="px-10 w-300">
        <QuizIntro />
        <MultipleQuizContainer multipleQuizzesInfo={multipleQuizInfo} />
      </div>
    </div>
  );
}
