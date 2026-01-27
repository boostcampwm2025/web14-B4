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
}

export default function QuizPageServer({
  quizzes,
  categories,
  category,
  difficulty,
}: QuizPageServerProps) {
  return (
    <div className="flex justify-center min-h-screen w-full">
      <div className="w-3/4 min-w-full">
        <div className="mx-auto min-w-100 max-w-350 p-10 bg-[var(--color-bg-default)]">
          <QuizHeader userName="철수" />

          <div className="flex justify-between items-center">
            <DifficultyFilter difficulty={difficulty} category={category} />
            <CategoryFilter
              categoriesData={categories}
              category={category}
              difficulty={difficulty}
            />
          </div>

          <QuizGrid quizzes={quizzes} />
        </div>
      </div>
    </div>
  );
}
