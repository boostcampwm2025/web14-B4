import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NaverLoginDto } from './dto/naver-login';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/naver')
  async loginNaver(@Body() dto: NaverLoginDto) {
    return await this.authService.loginWithNaver(dto);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') dto: RefreshTokenDto) {
    return await this.authService.refresh(dto.refreshToken);
  }
}
