export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
    limit: number;
  };
}
