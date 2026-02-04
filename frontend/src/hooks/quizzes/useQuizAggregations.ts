import { fetchAggregations } from '@/services/apis/quizApi';
import { useQuery } from '@tanstack/react-query';

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

export function useQuizAggregations(filters: QuizFilters) {
  return useQuery<AggregationsResponse>({
    queryKey: ['quiz-aggregations', filters.category, filters.difficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const data = await fetchAggregations(filters);

      return data;
    },
    staleTime: 3 * 60 * 1000, // 3분
    gcTime: 10 * 60 * 1000,
  });
}
