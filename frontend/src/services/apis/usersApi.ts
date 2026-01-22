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
