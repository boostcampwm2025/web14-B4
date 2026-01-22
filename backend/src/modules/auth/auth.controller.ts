import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverLoginDto } from './dto/naver-login';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    // UI 표시용으로 사용될 usename
    res.cookie('username', encodeURIComponent(user.username), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { sucess: true };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') dto: RefreshTokenDto) {
    return await this.authService.refresh(dto.refreshToken);
  }
}
