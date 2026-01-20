import MultipleQuizCard from './components/multiple-quizzes/MultipleQuizContainer';
import QuizIntro from './components/QuizIntro';

export default function MultipleQuizPage() {
  return (
    <div className="flex justify-center">
      <div className="px-10 w-300">
        <QuizIntro />
        <MultipleQuizCard />
      </div>
    </div>
  );
}
