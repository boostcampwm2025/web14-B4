import DifficultyFilter from './filters/DifficultyFilter';
import CategoryFilter from './filters/CategoryFilter';
import QuizGrid from './card/QuizGrid';
import QuizHeader from './header/QuizHeader';
import { CategoryCountsResponseDto, Quiz } from '../types/quiz';

interface QuizPageServerProps {
  quizzes: Quiz[];
  categories: CategoryCountsResponseDto;
  category?: string;
  difficulty?: string;
  username: string;
}

export default function QuizPageServer({
  quizzes,
  categories,
  category,
  difficulty,
  username,
}: QuizPageServerProps) {
  return (
    <main className="mx-auto p-10 bg-[var(--color-bg-default)]">
      <QuizHeader username={username} />

      <div className="flex justify-between items-center">
        <DifficultyFilter difficulty={difficulty} category={category} />
        <CategoryFilter categoriesData={categories} category={category} difficulty={difficulty} />
      </div>

      <QuizGrid quizzes={quizzes} />
    </main>
  );
}
