import { CommonResponse, NullDataErrorMessage } from '@/services/http/types';
import { ApiError } from '@/services/http/errors';
import { refreshAccessToken } from '@/services/apis/authApi';

// 슬래시 중복 방지
function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/$/, '');
}

function getApiBaseUrl() {
  // NextJS 서버에서 실행중인지 확인
  // window는 브라우저에만 존재하는 전역 객체. window가 없으면 = 브라우저가 아님 = Next 서버
  const isNextServer = typeof window === 'undefined';

  const baseUrl = isNextServer ? process.env.API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error(
      '[apiFetch] API Base URL이 설정되지 않았습니다. ' +
        '.env 파일의 API_BASE_URL 또는 NEXT_PUBLIC_API_BASE_URL을 확인하세요.',
    );
  }

  return normalizeBaseUrl(baseUrl);
}

// 인증 스킵 옵션 추가
interface ExtendedRequestInit extends RequestInit {
  skipAuth?: boolean;
}

/**
 * - 공통 API 처리
 * - 실패 시: 서버 message throw (추후 사용자 친화적 메시지 매핑이 필요해진다면 수정 필요)
 * - 성공 시: data 필드에 내용이 존재해야 함 (null이면 예외 처리)
 */

export async function apiFetch<T>(
  path: string,
  init?: ExtendedRequestInit,
  emptyData?: NullDataErrorMessage,
): Promise<T> {
  const API_BASE = getApiBaseUrl();
  const isClient = typeof window !== 'undefined';

  let res: Response;
  const { skipAuth, ...fetchInit } = init || {};

  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...fetchInit,
      credentials: 'include',
    });
  } catch {
    // 네트워크 단에서 죽는 케이스(서버 응답 자체가 없음)
    throw new ApiError('네트워크 오류가 발생했습니다.', 0, null);
  }

  // 응답 인터셉터 401 에러 감지 및 토큰 갱신
  if (res.status === 401 && !init?.skipAuth && isClient) {
    try {
      await refreshAccessToken();
      res = await fetch(`${API_BASE}${path}`, {
        ...fetchInit,
        credentials: 'include',
      });
    } catch (refreshError) {
      throw new ApiError('세션이 만료되었습니다. 다시 로그인해주세요.', 401, 'TOKEN_EXPIRED');
    }
  }

  // 공통 응답 처리
  let json: CommonResponse<T>;
  try {
    json = (await res.json()) as CommonResponse<T>;
  } catch {
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
