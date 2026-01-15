// app/quizzes/QuizPageClient.tsx
'use client';

import { fetchQuizzes, fetchCategoryCounts } from '@/services/quizApi';
import DifficultyFilter from './components/filters/DifficultyFilter';
import CategoryFilter from './components/filters/CategoryFilter';
import QuizGrid from './components/card/QuizGrid';
import QuizHeader from './components/header/QuizHeader';
import { useEffect, useState } from 'react';
import { CategoryCountsResponseDto, Quiz } from './types/quiz';
import { useSearchParams } from 'next/navigation';

export default function QuizPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const difficulty = searchParams.get('difficulty') ?? undefined;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<CategoryCountsResponseDto>();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const [quizResult, categoryData] = await Promise.all([
        fetchQuizzes(category, difficulty),
        fetchCategoryCounts(difficulty),
      ]);

      if (cancelled) return;

      setQuizzes(quizResult);
      setCategories(categoryData);
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [category, difficulty]);

  return (
    <main className="mx-auto p-10 bg-[var(--color-bg-default)]">
      <QuizHeader userName="철수" />

      <div className="flex justify-between items-center">
        <DifficultyFilter difficulty={difficulty} category={category} />
        <CategoryFilter categoriesData={categories} category={category} difficulty={difficulty} />
      </div>

      <QuizGrid quizzes={quizzes} />
    </main>
  );
}
