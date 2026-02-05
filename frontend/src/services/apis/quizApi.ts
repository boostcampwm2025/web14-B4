import { QuizChecklistResponseDto } from '@/app/checklist/types/checklist.types';
import {
  Quiz,
  CategoryCountsResponseDto,
  DIFFICULTY_MAP,
  QuizListData,
  QuizCategory,
} from '@/app/quizzes/types/quiz';
import { apiFetch } from '@/services/http/apiFetch';

export interface ChecklistSubmitResponseDto {
  savedCount: number;
}

interface FetchQuizzesParams {
  cursor?: string | null;
  limit?: number;
  category?: string;
  difficulty?: string;
}

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

export async function fetchAllQuizzes(): Promise<QuizListData> {
  const data = await apiFetch<QuizListData>(
    '/quizzes',
    { method: 'GET', next: { revalidate: 3600 } },
    { message: '퀴즈 목록 응답 데이터가 없습니다.' },
  );

  return data;
}

export async function fetchQuizzes({
  cursor,
  limit = 20,
  category,
  difficulty,
}: FetchQuizzesParams): Promise<QuizListData> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (cursor) params.append('cursor', cursor);
  if (category) params.append('category', category);
  if (!!difficulty && difficulty in DIFFICULTY_MAP) {
    params.append('difficulty', difficulty);
  }

  const query = params.toString();

  const data = await apiFetch<QuizListData>(
    `/quizzes${query ? `?${query}` : ''}`,
    { method: 'GET', cache: 'no-store' },
    { message: '퀴즈 목록 응답 데이터가 없습니다.' },
  );

  return data;
}

export async function fetchAggregations(filters?: QuizFilters): Promise<AggregationsResponse> {
  const params = new URLSearchParams();

  if (!!filters?.difficulty && filters.difficulty in DIFFICULTY_MAP)
    params.append('difficulty', filters.difficulty);

  const data = await apiFetch<AggregationsResponse>(
    `/quizzes/aggregations?${params.toString()}`,
    { method: 'GET', cache: 'no-store' },
    { message: '카테고리 정보 응답 데이터가 없습니다.' },
  );

  return data;
}

export async function fetchQuizCategory(): Promise<QuizCategory[]> {
  const params = new URLSearchParams();

  const data = await apiFetch<QuizCategory[]>(
    `/quizzes/categories`,
    { method: 'GET', cache: 'no-store' },
    { message: '카테고리 정보 응답 데이터가 없습니다.' },
  );
  return data;
}

export async function fetchQuiz(id: number): Promise<Quiz> {
  const data = await apiFetch<Quiz>(
    `/quizzes/${id}`,
    { method: 'GET', cache: 'no-store' },
    { message: '퀴즈 정보 응답 데이터가 없습니다.' },
  );

  return data;
}

export async function fetchQuizChecklistItems(
  mainQuizId: number,
): Promise<QuizChecklistResponseDto> {
  const data = await apiFetch<QuizChecklistResponseDto>(
    `/quizzes/${mainQuizId}/checklist`,
    { method: 'GET', cache: 'no-store' },
    { message: '체크리스트 목록 응답 데이터가 없습니다.' },
  );

  return data;
}
