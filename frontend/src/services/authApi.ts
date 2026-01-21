export async function loginWithNaver(code: string, state: string | null) {
  const response = await fetch('http://localhost:8080/auth/login/naver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data;
}
