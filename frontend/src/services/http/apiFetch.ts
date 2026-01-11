import { CommonResponse, NullDataErrorMessage } from '@/services/http/types';
import { ApiError } from '@/services/http/errors';

// 슬래시 중복 방지
function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, '');
}

function getApiBaseUrl() {
  const isServer = typeof window === 'undefined';

  const serverBase = isServer ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!serverBase) {
    throw new Error(
      '[apiFetch] API Base URL이 설정되지 않았습니다. ' +
        '.env 파일의 API_BASE_URL 또는 NEXT_PUBLIC_API_BASE_URL을 확인하세요.',
    );
  }

  return normalizeBaseUrl(serverBase);
}

/**
 * - 공통 API 처리
 * - 실패 시: 서버 message throw (추후 사용자 친화적 메시지 매핑이 필요해진다면 수정 필요)
 * - 성공 시: data 필드에 내용이 존재해야 함 (null이면 예외 처리)
 */

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  emptyData?: NullDataErrorMessage,
): Promise<T> {
  const API_BASE = getApiBaseUrl();

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

  if (json.data === null) {
    throw new ApiError(emptyData?.message || '응답 데이터가 없습니다.', res.status, json.errorCode);
  }

  return json.data;
}
