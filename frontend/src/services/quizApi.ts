import { QuizChecklistResponseDto } from '@/app/checklist/types/checklist.types';
import { Quiz, CategoryCountsResponseDto } from '@/app/quizzes/types/quiz';
import { apiFetch } from '@/services/http/apiFetch';

export interface ChecklistSubmitRequestDto {
  mainQuizId: number;
  solvedQuizId: number;
  checklistItems: {
    checklistItemId: number;
    isChecked: boolean;
  }[];
}

export interface ChecklistSubmitResponseDto {
  savedCount: number;
}

export async function fetchQuizzes(category?: string, difficulty?: string): Promise<Quiz[]> {
  const params = new URLSearchParams();

  if (category) params.append('category', category);
  if (difficulty) params.append('difficulty', difficulty);

  const query = params.toString();

  const data = await apiFetch<Quiz[]>(
    `/quizzes${query ? `?${query}` : ''}`,
    { method: 'GET', cache: 'no-store' },
    { message: '퀴즈 목록 응답 데이터가 없습니다.' },
  );

  return data;
}

export async function fetchCategoryCounts(): Promise<CategoryCountsResponseDto> {
  const data = await apiFetch<CategoryCountsResponseDto>(
    '/quizzes/categories',
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

export async function submitChecklist(req: ChecklistSubmitRequestDto) {
  const data = await apiFetch<ChecklistSubmitResponseDto>(
    '/users/checklist-progress',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    },
    { message: '체크리스트 제출이 실패했습니다.' },
  );

  return data;
}
