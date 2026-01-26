import { Quiz } from '../../types/quiz';
import QuizCard from './QuizCard';
import { MESSAGES } from '@/constants/quizzes.constant';

interface Quizzes {
  quizzes: Quiz[];
}

export default function QuizGrid({ quizzes }: Quizzes) {
  if (quizzes.length === 0) {
    return <p className="col-span-full text-center text-gray-500 py-10">{MESSAGES.NO_QUIZZES}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.mainQuizId} quiz={quiz} />
      ))}
    </div>
  );
}
