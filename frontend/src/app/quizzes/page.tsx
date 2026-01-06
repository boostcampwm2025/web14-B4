import { fetchQuizzes } from "@/src/services/quizApi";
import QuizCard from "@/src/components/quiz/QuizCard";

export default async function QuizPage() {
  const quizzes = await fetchQuizzes();

  return (
    <main className="mx-auto p-15 bg-[#F6F7F9]">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">뽁퀴즈 목록</h1>
        <p className="text-[#656464]">
          철수님은 어떤 CS 분야에서 성장하고 싶으신가요?
        </p>
      </header>

      <div className="flex gap-2 mb-8">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm">전체</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">운영체제</button>
        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">네트워크</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </main>
  );
}