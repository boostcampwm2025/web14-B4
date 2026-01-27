import { apiFetch } from '../http/apiFetch';

export async function loginWithNaver(code: string, state: string | null) {
  await apiFetch('/auth/login/naver', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, state }),
    skipAuth: true,
  });
}

export async function refreshAccessToken() {
  return await apiFetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    skipAuth: true,
  });
}

export async function logout() {
  await apiFetch('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}
