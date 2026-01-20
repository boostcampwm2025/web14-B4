'use client';

import { fetchQuizzes, fetchCategoryCounts } from '@/services/apis/quizApi';
import DifficultyFilter from './filters/DifficultyFilter';
import CategoryFilter from './filters/CategoryFilter';
import QuizGrid from './card/QuizGrid';
import QuizHeader from './header/QuizHeader';
import { useEffect, useState } from 'react';
import { CategoryCountsResponseDto, Quiz } from '../types/quiz';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function QuizPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') ?? undefined;
  const difficulty = searchParams.get('difficulty') ?? undefined;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<CategoryCountsResponseDto>();

  useEffect(() => {
    const errorType = searchParams.get('error');

    if (errorType === 'not_found') {
      toast.error('해당 퀴즈 기록이 존재하지 않습니다');
      router.replace('/quizzes');
    }
  }, [searchParams, router]);

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
