import { QuizCategory } from '@/app/quizzes/types/quiz';
import { fetchAggregations, fetchQuizCategory } from '@/services/apis/quizApi';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface QuizFilters {
  category?: string;
  difficulty?: string;
}

interface AggregationsResponse {
  categories: Array<{
    name: string | null;
    count: number;
  }>;
  total: number;
}

export function useQuizCategories() {
  return useQuery({
    queryKey: ['all-categories'],
    queryFn: () => fetchQuizCategory(),
    staleTime: Infinity, // 영구 캐시
    gcTime: 1000 * 60 * 60 * 24, // 24시간 후 메모리에서 제거
  });
}

export function useQuizAggregations(filters: QuizFilters) {
  return useQuery<AggregationsResponse>({
    queryKey: ['quiz-aggregations', filters.category, filters.difficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const data = await fetchAggregations(filters);

      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useGetQuizCategoryWithCount(
  allCategories?: QuizCategory[],
  aggregations?: AggregationsResponse,
) {
  return useMemo(() => {
    return allCategories?.map((category) => ({
      ...category,
      count: aggregations?.categories.find((a) => a.name === category.name)?.count || 0,
    }));
  }, [allCategories, aggregations]);
}
