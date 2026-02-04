import { CursorPaginatedResult } from '../interfaces/pagination.interface';

export function createCursorPaginatedResult<T>(
  data: T[],
  limit: number,
  id: keyof T,
): CursorPaginatedResult<T> {
  const hasNextPage = data.length > limit;
  const items = hasNextPage ? data.slice(0, limit) : data;
  const nextCursor = hasNextPage ? String(items[items.length - 1][id]) : null;

  return {
    data: items,
    meta: {
      nextCursor,
      hasNextPage,
      limit,
    },
  };
}
