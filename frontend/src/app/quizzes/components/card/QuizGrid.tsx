import { Quiz } from '../../types/quiz';
import QuizCard from './QuizCard';
import { MESSAGES } from '@/constants/quizzes.constant';

interface QuizGridProps {
  quizzes: Quiz[];
  isLoading?: boolean;
}

export default function QuizGrid({ quizzes, isLoading }: QuizGridProps) {
  // 초기 로딩 중
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  // 퀴즈 없음
  if (quizzes.length === 0) {
    return <p className="col-span-full text-center text-gray-500 py-10">{MESSAGES.NO_QUIZZES}</p>;
  }

  // 퀴즈 표시
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.mainQuizId} quiz={quiz} />
      ))}
    </div>
  );
}
