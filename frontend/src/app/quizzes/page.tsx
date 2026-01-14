import { fetchQuizzes, fetchCategoryCounts } from '@/services/quizApi';
import DifficultyFilter from './components/filters/DifficultyFilter';
import CategoryFilter from './components/filters/CategoryFilter';
import QuizGrid from './components/card/QuizGrid';
import QuizHeader from './components/header/QuizHeader';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
  }>;
}

export default async function QuizPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { category, difficulty } = searchParams;
  const [quizzes, categoryData] = await Promise.all([
    fetchQuizzes(category, difficulty),
    fetchCategoryCounts(),
  ]);
  const { totalCount, categories } = categoryData;

  return (
    <main className="mx-auto p-10 bg-[var(--color-bg-default)]">
      <QuizHeader userName="철수" />

      <div className="flex justify-between items-center">
        <DifficultyFilter difficulty={difficulty} category={category} />
        <CategoryFilter
          categories={categories}
          totalCount={totalCount}
          category={category}
          difficulty={difficulty}
        />
      </div>

      <QuizGrid quizzes={quizzes} />
    </main>
  );
}
