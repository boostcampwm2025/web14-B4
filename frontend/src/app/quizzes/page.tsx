import { fetchQuizzes, fetchCategoryCounts } from '@/services/quizApi';
import QuizCard from '@/app/quizzes/components/QuizCard';
import Link from 'next/link';
import { QuizCategoryWithCount } from './types/quiz';
import DifficultyFilter from './components/filters/DifficultyFilter';
import CategoryFilter from './components/filters/CategoryFilter';

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

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (difficulty) params.set('difficulty', difficulty);

    if (value === '전체') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    return params.toString() ? `?${params.toString()}` : '/quizzes';
  };

  const getCategoryButtonStyle = (target: string) => {
    const isActive = target === '전체' ? !category : category === target;
    if (isActive) {
      return 'flex items-center justify-center px-2 py-1 bg-[var(--color-primary)] text-white rounded-lg text-lg transition';
    }
    return 'flex items-center justify-center px-2 py-1 bg-white text-black rounded-lg text-lg hover:bg-gray-200 transition';
  };

  const getCountBadgeStyle = (targetName: string) => {
    const isActive = targetName === '전체' ? !category : category === targetName;

    if (isActive) return 'm-1 bg-white text-black';

    return 'm-1 bg-[var(--color-gray-light)] text-black';
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => <QuizCard key={quiz.mainQuizId} quiz={quiz} />)
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            해당하는 퀴즈가 없습니다. 😅
          </p>
        )}
      </div>
    </main>
  );
}
