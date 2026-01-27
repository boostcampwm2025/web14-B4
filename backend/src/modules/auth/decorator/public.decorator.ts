import { SetMetadata } from '@nestjs/common';

// JWT 인증이 따로 필요하지 않은 라우트
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
