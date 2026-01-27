'use client';

interface QuizHeaderProps {
  username?: string;
}

export default function QuizHeader({ username = '게스트' }: QuizHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold mb-2">뽁퀴즈 목록</h1>
      <p className="text-[var(--color-gray-dark)]">
        {username}님은 어떤 CS 분야에서 성장하고 싶으신가요?
      </p>
    </header>
  );
}
