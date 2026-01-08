import { QuizChecklistResponseDto } from '@/app/checklist/types/checklist.types';
import { Quiz } from '@/app/quizzes/types/quiz';

const BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode: string | null;
  data: T;
}

export async function fetchQuizzes(category?: string, difficulty?: string): Promise<Quiz[]> {
  const params = new URLSearchParams();

  if (category) params.append('category', category);
  if (difficulty) params.append('difficulty', difficulty);

  try {
    const res = await fetch(`${BASE_URL}/quizzes?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('서버와의 통신이 원활하지 않습니다.');
    }

    const responseBody: ApiResponse<Quiz[]> = await res.json();

    if (!responseBody.success) {
      throw new Error(responseBody.message || '퀴즈 목록을 불러오는데 실패했습니다.');
    }

    return responseBody.data;
  } catch (error) {
    console.error('Fetch Quizzes Error:', error);
    throw error;
  }
}

export async function fetchCategoryCounts() {
  try {
    const res = await fetch(`${BASE_URL}/quizzes/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('서버와의 통신이 원활하지 않습니다.');
    }

    const responseBody = await res.json();

    if (!responseBody.success) {
      throw new Error(responseBody.message || '카테고리 정보를 불러오는데 실패했습니다.');
    }

    return responseBody.data;
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    throw error;
  }
}

<<<<<<< HEAD
export async function fetchQuiz(id: number): Promise<Quiz> {
  try {
    const res = await fetch(`${BASE_URL}/quizzes/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('서버와의 통신이 원활하지 않습니다.');
    }

    const responseBody: ApiResponse<Quiz> = await res.json();

    if (!responseBody.success) {
      throw new Error(responseBody.message || '퀴즈 정보를 불러오는데 실패했습니다.');
    }

    return responseBody.data;
  } catch (error) {
    console.error('Fetch Quiz Error:', error);
    throw error;
  }
}

=======
>>>>>>> dbca6bb (chore: 충돌 해결)
export async function fetchQuizChecklistItems(mainQuizId: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/quizzes/${mainQuizId}/checklist`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('서버와의 통신이 원활하지 않습니다.');
    }

    const responseBody: ApiResponse<QuizChecklistResponseDto> = await res.json();

    if (!responseBody.success) {
      throw new Error(responseBody.message || '체크리스트 목록을 불러오는데 실패했습니다.');
    }

    return responseBody.data;
  } catch (error) {
    console.error('Fetch Quizzes Error:', error);
    throw error;
  }
}
