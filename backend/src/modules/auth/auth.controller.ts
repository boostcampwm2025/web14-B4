import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverLoginDto } from './dto/naver-login';
import type { Response, Request } from 'express';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { Public } from './decorator/public.decorator';
import { clearGuestUserIdCookie } from './utils/guest-user.util';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login/naver')
  async loginNaver(
    @Body() dto: NaverLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.loginWithNaver(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    // UI 표시용으로 사용될 username
    res.cookie('username', user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 게스트 쿠키 삭제
    clearGuestUserIdCookie(res);

    return { success: true };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;

    if (!refreshToken) {
      throw new BusinessException(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
    }

    const newTokens = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return { success: true };
  }

  @Public()
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;
    // RT가 있으면 Redis에서 삭제
    if (refreshToken) {
      const payload = this.authService.verifyRefreshToken(refreshToken);
      await this.authService.logout(payload.sub);
    }

    // 모든 쿠키 및 username 삭제
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('username');
    clearGuestUserIdCookie(res);

    return { success: true };
  }
}
