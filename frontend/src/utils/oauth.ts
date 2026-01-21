import { v4 as uuidv4 } from 'uuid';
import { NAVER_STATE_KEY, NAVER_AUTH_BASE_URL } from '@/constants/auth';

// UUID v4를 사용하여 State 값 생성
export function generateRandomState(): string {
  return uuidv4();
}

// State를 세션 스토리지에 저장하고 네이버 로그인 URL 반환
export function getNaverLoginUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
  const baseUrl = NAVER_AUTH_BASE_URL;

  if (!clientId || !redirectUri) {
    console.error('네이버 로그인 환경변수가 설정되지 않았습니다.');
    return '#';
  }

  const state = generateRandomState();
  sessionStorage.setItem(NAVER_STATE_KEY, state);

  return `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&state=${state}`;
}

// State 검증 함수
export function verifyState(urlState: string | null): boolean {
  if (!urlState) return false;

  const savedState = sessionStorage.getItem(NAVER_STATE_KEY);
  sessionStorage.removeItem(NAVER_STATE_KEY);
  return urlState === savedState;
}
