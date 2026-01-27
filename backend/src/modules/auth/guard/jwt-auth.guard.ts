import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

// JWT 인증 담당 Guard(JwtStrategy를 실행해 토큰을 검증)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      // 토큰이 있다면 검증하여 req.user에 유저 정보를 담음
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      // Public인데 토큰이 없거나 유효하지 않은 경우 에러를 던지지 않고 통과시킴
      if (isPublic) return true;
      throw err; // Public이 아니면 기존대로 에러 발생
    }
  }

  // 토큰 검증 결과 처리: @Public()이면 null 허용, 아니면 401 예외 발생
  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (err || !user) {
      if (isPublic) {
        return null as TUser;
      }
      throw new BusinessException(ERROR_MESSAGES.ACCESS_DENIED);
    }
    return user;
  }
}
