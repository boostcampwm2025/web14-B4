// 외부 API (클로바, 제미나이) 오류 스택 로깅용 유틸

import type { WinstonLogger } from 'nest-winston';

type ExternalApiProvider = 'GEMINI' | 'CLOVA';

type ExternalApiError = Error & {
  status?: number;
  code?: string;
  response?: {
    status?: number;
    data?: unknown;
    headers?: Record<string, unknown>;
  };
  cause?: unknown;
};

// 로그에 남길 메타데이터 추가 가능
type LogMeta = Record<string, unknown>;

export function logExternalApiError(
  logger: WinstonLogger,
  provider: ExternalApiProvider,
  label: string,
  error: unknown,
  meta: LogMeta = {},
): void {
  // 오류 객체일 경우
  if (error instanceof Error) {
    const err = error as ExternalApiError;
    const status = err.status ?? err.response?.status;

    logger.error(
      {
        message: label,
        provider,
        ...meta,
        status,
        code: err.code,
        responseData: err.response?.data,
        cause: err.cause,
      },
      err.stack,
    );
    return;
  }

  // 오류 객체가 아닐 경우
  logger.error({
    message: `${label} - Unknown Throwable`,
    provider,
    ...meta,
    throwable: error,
  });
}
