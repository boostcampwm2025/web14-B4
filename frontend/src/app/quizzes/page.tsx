import { fetchQuizzes, fetchCategoryCounts } from '@/services/quizApi';
import QuizCard from '@/app/quizzes/components/QuizCard';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
  }>;
}

interface Category {
  id: number;
  name: string;
  count: number;
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

  const difficultyStyleMap: Record<string, string> = {
    상: 'bg-[var(--color-difficulty-high-bg)] text-[var(--color-difficulty-high-text)]',
    중: 'bg-[var(--color-difficulty-mid-bg)] text-[var(--color-difficulty-mid-text)]',
    하: 'bg-[var(--color-difficulty-low-bg)] text-[var(--color-difficulty-low-text)]',
  };

  const getDifficultyButtonStyle = (target: string) => {
    const isActive = target === '전체' ? !difficulty : difficulty === target;
    if (isActive) {
      if (target === '전체') {
        return 'px-3 py-2 bg-blue-500 text-white rounded-full text-lg transition font-bold';
      }
      return `px-3 py-2 ${difficultyStyleMap[target]} rounded-full text-lg transition font-bold`;
    }
    return 'px-3 py-2 bg-[var(--color-gray-light)] text-[var(--color-gray-dark)] rounded-full text-lg hover:bg-gray-200 transition';
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
        <div className="flex flex-col">
          <div className="mb-3 text-xl font-semibold">난이도</div>
          <div className="flex gap-2 mb-8">
            <Link
              href={createQueryString('difficulty', '전체')}
              className={getDifficultyButtonStyle('전체')}
            >
              전체
            </Link>
            <Link
              href={createQueryString('difficulty', '상')}
              className={getDifficultyButtonStyle('상')}
            >
              상
            </Link>
            <Link
              href={createQueryString('difficulty', '중')}
              className={getDifficultyButtonStyle('중')}
            >
              중
            </Link>
            <Link
              href={createQueryString('difficulty', '하')}
              className={getDifficultyButtonStyle('하')}
            >
              하
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xl font-semibold">분야</div>
          <div className="flex gap-2 mb-8">
            <Link
              href={createQueryString('category', '전체')}
              className={getCategoryButtonStyle('전체')}
            >
              <span>전체</span>
              <span
                className={`flex items-center justify-center w-7 h-7 p-2 rounded-full text-lg ${getCountBadgeStyle('전체')}`}
              >
                {totalCount}
              </span>
            </Link>
            {categories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={createQueryString('category', cat.name)}
                className={getCategoryButtonStyle(cat.name)}
              >
                <span>{cat.name}</span>
                <span
                  className={`flex items-center justify-center w-7 h-7 p-2 rounded-full text-lg ${getCountBadgeStyle(cat.name)}`}
                >
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            해당하는 퀴즈가 없습니다. 😅
          </p>
        )}
      </div>
    </main>
  );
}
