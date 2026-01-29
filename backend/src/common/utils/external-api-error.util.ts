// 외부 API(클로바, 제미나이)가 반환하는 오류 메시지 로깅용 유틸

import type { WinstonLogger } from 'nest-winston';

type ExternalApiProvider = 'GEMINI' | 'CLOVA' | 'NAVER';
type LogMeta = Record<string, unknown>; // 로그에 남길 메타데이터 추가 가능
const MSG_MAX_LEN = 1000;

function safeStringify(value: unknown): string {
  const seen = new WeakSet<object>();

  return JSON.stringify(value, (_key: string, val: unknown): unknown => {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) {
        return '[Circular]';
      }
      seen.add(val);
    }

    if (typeof val === 'bigint') {
      return val.toString();
    }

    return val;
  });
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...(truncated)`;
}

export function logExternalApiError(
  logger: WinstonLogger,
  provider: ExternalApiProvider,
  label: string,
  error: unknown,
  meta: LogMeta = {},
): void {
  if (error instanceof Error) {
    const err = error as Error & {
      status?: number;
      response?: { status?: number; data?: unknown };
    };

    const status = err.status ?? err.response?.status;
    const msg = truncate(err.message ?? '', MSG_MAX_LEN);

    logger.error(
      `${label} | provider=${provider} | status=${status} | name=${err.name} | message=${msg} | meta=${safeStringify(meta)}`,
    );
    return;
  }

  logger.error(
    `${label} | provider=${provider} | meta=${safeStringify(meta)} | throwable=${safeStringify(error)}`,
  );
}
