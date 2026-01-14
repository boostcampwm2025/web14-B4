import { fetchQuizzes, fetchCategoryCounts } from '@/services/quizApi';
import QuizCard from '@/app/quizzes/components/card/QuizCard';
import DifficultyFilter from './components/filters/DifficultyFilter';
import CategoryFilter from './components/filters/CategoryFilter';
import QuizGrid from './components/card/QuizGrid';

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
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">뽁퀴즈 목록</h1>
        <p className="text-[var(--color-gray-dark)]">
          철수님은 어떤 CS 분야에서 성장하고 싶으신가요?
        </p>
      </header>

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
