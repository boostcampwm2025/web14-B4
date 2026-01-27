import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

// JWT 인증 담당 Guard(JwtStrategy를 실행해 토큰을 검증)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: unknown,
    user: unknown,
    info: unknown,
  ): TUser {
    // 실패하면 에러 발생
    if (err || !user || info) {
      throw new BusinessException(ERROR_MESSAGES.ACCESS_DENIED);
    }
    // 성공하면 user 반환
    return user as TUser;
  }
}
