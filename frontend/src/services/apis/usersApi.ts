import { ComprehensionData, SolvedData } from '@/app/user/types/table';
import { apiFetch } from '@/services/http/apiFetch';
import type { Importance } from '@/types/solvedQuiz.types.ts';

export type SaveImportanceRequest = {
  mainQuizId: number;
  solvedQuizId: number;
  importance: Importance;
};

export type SaveImportanceResponse = {
  solvedQuizId: number;
  importance: Importance;
};

export type GetUserComprehensionsResponse = {
  comprehensionData: ComprehensionData[];
};

export type GetUserSolvedStatisticsResponse = {
  solvedData: SolvedData[];
};

/**
 * 피드백 화면에서 사용자가 선택한 중요도를 API로 전송하여 DB저장 요청
 * - POST /users/importance
 * - 응답: { solvedQuizId, importance }
 */
export async function postImportance(req: SaveImportanceRequest): Promise<SaveImportanceResponse> {
  const data = await apiFetch<SaveImportanceResponse>('/users/importance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  // 런타임 방어
  const solvedQuizId =
    typeof data.solvedQuizId === 'string' ? Number(data.solvedQuizId) : data.solvedQuizId;

  const isValidImportance =
    data.importance === 'LOW' || data.importance === 'NORMAL' || data.importance === 'HIGH';

  if (typeof solvedQuizId !== 'number' || Number.isNaN(solvedQuizId) || !isValidImportance) {
    throw new Error('중요도 저장 응답 형식이 올바르지 않습니다.');
  }

  return { solvedQuizId, importance: data.importance };
}

/**
 * 사용자의 푼 퀴즈별 이해도 조회
 * - GET /users/solved-quizzes/category-comprehension
 * - 응답: { comprehensionData }
 */
export async function getUserComprehensions(): Promise<GetUserComprehensionsResponse> {
  const data = await apiFetch<GetUserComprehensionsResponse>(
    '/users/solved-quizzes/category-comprehension',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
    { message: '통계 데이터가 존재하지 않습니다.' },
  );

  return data;
}

/**
 * 사용자의 푼 퀴즈별 진행도 조회
 * - GET /users/solved-quizzes/statistics
 * - 응답: { solvedData }
 */
export async function getUserSolvedStatistics(): Promise<GetUserSolvedStatisticsResponse> {
  const data = await apiFetch<GetUserSolvedStatisticsResponse>(
    '/users/solved-quizzes/statistics',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
    { message: '통계 데이터가 존재하지 않습니다.' },
  );

  // 실제로 푼 문제가 있는 카테고리만 필터링
  const filteredSolvedData = data.solvedData.filter((item) => item.solvedQuizAmount > 0);

  return {
    ...data,
    solvedData: filteredSolvedData,
  };

  return data;
}
