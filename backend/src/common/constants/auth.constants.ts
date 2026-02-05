// 토큰 만료 시간 (JWT용)
export const ACCESS_TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '7d';

// 쿠키 만료 시간 (밀리초)
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 1000; // 1시간
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7일
export const USERNAME_COOKIE_MAX_AGE = ACCESS_TOKEN_MAX_AGE; // AT와 동일

// Redis TTL (초)
export const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7일
