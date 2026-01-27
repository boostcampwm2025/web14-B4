import { Request, Response } from 'express';
import { User } from 'src/datasources/entities/tb-user.entity';
import { AuthService } from '../auth.service';

const GUEST_USER_COOKIE_NAME = 'guestUserId';
const GUEST_USER_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

// 게스트 userId를 가져오거나 생성
export async function getOrCreateGuestUserId(
  user: User | undefined,
  req: Request,
  res: Response,
  authService: AuthService,
): Promise<number> {
  // 로그인 사용자인 경우 해당 userId 반환
  if (user) {
    return user.userId;
  }

  // 쿠키에서 guestUserId 확인
  const guestUserIdFromCookie = req.cookies[GUEST_USER_COOKIE_NAME];
  if (guestUserIdFromCookie) {
    return parseInt(guestUserIdFromCookie, 10);
  }

  // 게스트 User 생성 및 쿠키 저장
  const guestUser = await authService.createGuestUser();
  res.cookie(GUEST_USER_COOKIE_NAME, guestUser.userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: GUEST_USER_COOKIE_MAX_AGE,
  });
  return guestUser.userId;
}

// guestUserId 쿠키 삭제
export function clearGuestUserIdCookie(res: Response): void {
  res.clearCookie(GUEST_USER_COOKIE_NAME);
}
