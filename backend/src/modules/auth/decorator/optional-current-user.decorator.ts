import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/datasources/entities/tb-user.entity';

interface RequestWithUser {
  user?: User;
}

// @Public이 적용된 엔드포인트에서 사용
// 로그인 시에 User 객체, 비로그인 시에 undefined를 반환
export const OptionalCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
