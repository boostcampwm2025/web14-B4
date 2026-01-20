import { fetchMultipleChoices } from '@/services/apis/multipleQuizApi';
import MultipleQuizContainer from './components/multiple-quizzes/MultipleQuizContainer';
import QuizIntro from './components/QuizIntro';

export default async function MultipleQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mainQuizId = Number(id);
  // 페이지 렌더링 시, 해당 메인 퀴즈의 객관식 퀴즈들 요청하여 상태값에 저장

  const multipleChoices = await fetchMultipleChoices(mainQuizId);

  return (
    <div className="flex justify-center">
      <div className="px-10 w-300">
        <QuizIntro />
        <MultipleQuizContainer multipleChoices={multipleChoices} />
      </div>
    </div>
  );
}
