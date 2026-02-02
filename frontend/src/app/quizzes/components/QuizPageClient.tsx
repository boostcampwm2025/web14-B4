'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useMemo } from 'react';
import DifficultyFilter from './filters/DifficultyFilter';
import CategoryFilter from './filters/CategoryFilter';
import QuizGrid from './card/QuizGrid';
import QuizHeader from './header/QuizHeader';
import { CategoryCountsResponseDto, Quiz } from '../types/quiz';
import { fetchQuizzes } from '@/services/apis/quizApi';

interface QuizPageClientProps {
  initialData: {
    data: Quiz[];
    meta: {
      nextCursor: string | null;
      hasNextPage: boolean;
      limit: number;
    };
  };
  filters: {
    category?: string;
    difficulty?: string;
  };
  username: string;
}

export default function QuizPageClient({ initialData, filters, username }: QuizPageClientProps) {
  const { category, difficulty } = filters;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['quizzes', category, difficulty],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const result = await fetchQuizzes({
        cursor: pageParam ?? undefined,
        limit: 20,
        category,
        difficulty,
      });

      return {
        data: result.data,
        nextCursor: result.meta.nextCursor,
        hasMore: result.meta.hasNextPage,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : null;
    },
    initialPageParam: null,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 페이지의 퀴즈를 하나의 배열로 합치기
  const allQuizzes = data?.pages.flatMap((page) => page.data) ?? [];

  // ⭐ 현재 조회된 데이터를 기반으로 카테고리 카운트 계산
  const categoryCounts = useMemo((): CategoryCountsResponseDto => {
    const categoryMap = new Map<
      string,
      {
        quizCategoryId: number;
        id: number;
        name: string;
        count: number;
      }
    >();

    allQuizzes.forEach((quiz) => {
      const categoryName = quiz.quizCategory.name;
      const categoryId = quiz.quizCategory.quizCategoryId;

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          quizCategoryId: categoryId,
          id: categoryId,
          name: categoryName,
          count: 0,
        });
      }

      const category = categoryMap.get(categoryName)!;
      category.count += 1;
    });

    return {
      totalCount: allQuizzes.length,
      categories: Array.from(categoryMap.values()),
    };
  }, [allQuizzes]);

  return (
    <div className="flex justify-center min-h-screen w-full">
      <div className="w-3/4 min-w-full">
        <div className="mx-auto min-w-100 max-w-350 p-10 bg-[var(--color-bg-default)]">
          <QuizHeader username={username} />

          <div className="flex justify-between items-center mb-6">
            <DifficultyFilter difficulty={difficulty} category={category} />
            <CategoryFilter
              categoriesData={categoryCounts}
              category={category}
              difficulty={difficulty}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <QuizGrid quizzes={allQuizzes} />

              {allQuizzes.length > 0 && <div ref={observerRef} className="h-10 w-full" />}

              {isFetchingNextPage && (
                <div className="text-center py-8">
                  <p className="text-gray-500">퀴즈를 더 불러오는 중...</p>
                </div>
              )}

              {!hasNextPage && allQuizzes.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">모든 퀴즈를 불러왔습니다.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
