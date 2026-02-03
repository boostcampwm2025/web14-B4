import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import {
  ACCESS_TOKEN_MAX_AGE,
  USERNAME_COOKIE_MAX_AGE,
} from 'src/common/constants/auth.constants';

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    // RT가 없으면 갱신 불가
    if (!refreshToken) {
      return next();
    }

    // AT가 없거나 만료된 경우
    if (!accessToken || this.isAccessTokenExpired(accessToken)) {
      try {
        const newTokens =
          await this.authService.refreshAccessTokenOnly(refreshToken);
        // 새 쿠키 설정
        this.setTokenCookies(res, newTokens);
        // 현재 요청의 쿠키 업데이트
        req.cookies['accessToken'] = newTokens.accessToken;
      } catch {
        // refresh 실패 시 기존 흐름 진행
      }
    }

    return next();
  }

  private setTokenCookies(
    res: Response,
    tokens: { accessToken: string; username: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie('username', tokens.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: USERNAME_COOKIE_MAX_AGE,
    });
  }

  private isAccessTokenExpired(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return false;
    } catch (err) {
      return err.name === 'TokenExpiredError';
    }
  }
}
