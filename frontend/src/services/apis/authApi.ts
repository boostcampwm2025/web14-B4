import { apiFetch } from '../http/apiFetch';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    uuid: number;
    username: string;
  };
}

export async function loginWithNaver(code: string, state: string | null) {
  const data = await apiFetch<LoginResponse>('/api/auth/login/naver', {
    method: 'POST',
    body: JSON.stringify({ code, state }),
    skipAuth: true,
  });
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다.');
  }

  return await apiFetch<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    skipAuth: true,
  });
}
