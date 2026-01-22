import { apiFetch } from '../http/apiFetch';

export async function loginWithNaver(code: string, state: string | null) {
  await apiFetch('/auth/login/naver', {
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

  return await apiFetch<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    skipAuth: true,
  });
}
