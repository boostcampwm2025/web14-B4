import { fetchQuizzes } from '@/services/apis/quizApi';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export function useGetQuizzes(category?: string, difficulty?: string) {
  return useInfiniteQuery({
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
}

export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.1,
}: UseInfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentObserver = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold },
    );

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, threshold]);

  return observerRef;
}
