import { CommonResponse } from '@/services/http/types';
import { ApiError } from '@/services/http/errors';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api';

/**
 * - 공통 API 처리
 * - 실패 시: 서버 message throw (추후 사용자 친화적 메시지 매핑이 필요해진다면 수정 필요)
 * - 응답 data 필드 null 허용
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch {
    // 네트워크 단에서 죽는 케이스(서버 응답 자체가 없음)
    throw new ApiError('네트워크 오류가 발생했습니다.', 0, null);
  }

  let json: CommonResponse<T>;
  try {
    json = (await res.json()) as CommonResponse<T>;
  } catch {
    // 응답은 받았으나 공통 응답 json 파싱 실패
    throw new ApiError('서버 응답을 해석할 수 없습니다.', res.status, null);
  }

  if (!res.ok || !json.success) {
    throw new ApiError(json.message || `요청 실패 (${res.status})`, res.status, json.errorCode);
  }

  return json.data;
}
