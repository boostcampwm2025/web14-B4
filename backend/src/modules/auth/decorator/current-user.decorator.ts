import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/datasources/entities/tb-user.entity';

interface RequestWithUser {
  user: User;
}

// 컨트롤러에서 현재 인증된 사용자 정보를 바로 주입하기 위한 데코레이터
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
