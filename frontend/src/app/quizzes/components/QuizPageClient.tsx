'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useMemo } from 'react';
import DifficultyFilter from './filters/DifficultyFilter';
import CategoryFilter from './filters/CategoryFilter';
import QuizGrid from './card/QuizGrid';
import QuizHeader from './header/QuizHeader';
import { Quiz } from '../types/quiz';
import { fetchAggregations, fetchQuizCategory, fetchQuizzes } from '@/services/apis/quizApi';
import { useQuizAggregations } from '@/hooks/quizzes/useQuizAggregations';

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

  // 전체 카테고리 조회 (캐싱)
  const { data: allCategories } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => fetchQuizCategory(),
    staleTime: Infinity, // 영구 캐시
    gcTime: 1000 * 60 * 60 * 24, // 24시간 후 메모리에서 제거
  });

  // 집계 데이터 조회 (캐싱)
  const {
    data: aggregations,
    isLoading: isLoadingAggregations,
    error,
  } = useQuizAggregations(filters);

  // 병합
  const categoriesWithCount = useMemo(() => {
    return allCategories?.map((category) => ({
      ...category,
      count: aggregations?.categories.find((a) => a.name === category.name)?.count || 0,
    }));
  }, [allCategories, aggregations]);

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

  const allQuizzes = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex justify-center min-h-screen w-full">
      <div className="w-3/4 min-w-full">
        <div className="mx-auto min-w-100 max-w-350 p-10 bg-[var(--color-bg-default)]">
          <QuizHeader username={username} />

          <div className="flex justify-between items-center mb-6">
            <DifficultyFilter difficulty={difficulty} category={category} />
            <CategoryFilter
              categories={categoriesWithCount}
              total={aggregations?.total}
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
