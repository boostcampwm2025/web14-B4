import { fetchQuizzes } from "@/src/services/quizApi";
import QuizCard from "@/src/components/quiz/QuizCard";
import Link from "next/link";

interface PageProps {
  searchParams: Promise< {
    category?: string;
    difficulty?: string;
  }>;
}

export default async function QuizPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { category, difficulty } = searchParams;
  const quizzes = await fetchQuizzes(category, difficulty);
  const currentCategory = searchParams.category || '전체';

  const getCategoryButtonStyle = (targetCategory: string) => {
    const isActive = targetCategory === currentCategory || (targetCategory === '전체' && !category); 
    return isActive
      ? "px-4 py-2 bg-blue-500 text-white rounded-lg text-lg transition"
      : "px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-lg hover:bg-gray-200 transition";
  }

  const difficultyStyleMap: Record<string, string> = {
    상: "bg-[var(--color-difficulty-high-bg)] text-[var(--color-difficulty-high-text)]",
    중: "bg-[var(--color-difficulty-mid-bg)] text-[var(--color-difficulty-mid-text)]",
    하: "bg-[var(--color-difficulty-low-bg)] text-[var(--color-difficulty-low-text)]",
  };


  const getDifficultyButtonStyle = (targetDifficulty: string) => {
    const isActive = targetDifficulty === difficulty || (targetDifficulty === '전체' && !difficulty);
    
    if (!isActive) {
      return "px-3 py-2 bg-gray-100 text-gray-600 rounded-full text-lg hover:bg-gray-200 transition";
    }

    if (targetDifficulty === '전체') {
      return "px-3 py-2 bg-blue-500 text-white rounded-full text-lg transition";
    }

    return `px-3 py-2 ${difficultyStyleMap[targetDifficulty]} rounded-full text-lg transition`;
  }

  return (
    <main className="mx-auto p-15 bg-[var(--color-bg-default)]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">뽁퀴즈 목록</h1>
        <p className="text-[var(--color-gray-dark)]">
          철수님은 어떤 CS 분야에서 성장하고 싶으신가요?
        </p>
      </header>

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="mb-3 text-xl font-semibold">
            난이도
          </div>
          <div className="flex gap-2 mb-8">
            <Link href="/quizzes" className={getDifficultyButtonStyle('전체')}>
              전체
            </Link>
            <Link href="/quizzes?difficulty=상" className={getDifficultyButtonStyle('상')}>
              상
            </Link>
            <Link href="/quizzes?difficulty=중" className={getDifficultyButtonStyle('중')}>
              중
            </Link>
            <Link href="/quizzes?difficulty=하" className={getDifficultyButtonStyle('하')}>
              하
            </Link>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-3 text-xl font-semibold">
            분야
          </div> 
          <div className="flex gap-2 mb-8">
            <Link href="/quizzes" className={getCategoryButtonStyle('전체')}>
              전체
            </Link> 
            
            <Link href="/quizzes?category=운영체제" className={getCategoryButtonStyle('운영체제')}>
              운영체제
            </Link>
            
            <Link href="/quizzes?category=네트워크" className={getCategoryButtonStyle('네트워크')}>
              네트워크
            </Link>
            
            <Link href="/quizzes?category=데이터베이스" className={getCategoryButtonStyle('데이터베이스')}>
              데이터베이스
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            해당하는 퀴즈가 없습니다. 😅
          </p>
        )}
      </div>
    </main>
  );
}