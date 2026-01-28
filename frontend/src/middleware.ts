import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isLoginPage = request.nextUrl.pathname === '/';
  const isAuthenticated = Boolean(token);

  // 인증된 사용자가 로그인 페이지 접근 시
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/quizzes', request.url));
  }

  // 미인증 사용자가 로그인 및 리포트 페이지 접근 시
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/user')) {
    return NextResponse.redirect(new URL('/?error=auth_required', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/user'],
};
