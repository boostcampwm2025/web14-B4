import {
  format,
  transports,
  type LoggerOptions,
  type transport,
} from 'winston';
import type { TransformableInfo } from 'logform';
import 'winston-daily-rotate-file';
import type { LoggerSettings } from './logger.config';

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

function stringifyMessage(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Error) {
    return value.stack ?? value.message;
  }
  try {
    return safeStringify(value);
  } catch {
    return String(value);
  }
}

function formatLog({
  timestamp,
  level,
  message,
  context,
}: TransformableInfo): string {
  const msg = stringifyMessage(message);
  const ctx = typeof context === 'string' ? `[${context}]` : '';

  return `${timestamp as string} [${level}]${ctx} ${msg}`;
}

const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(formatLog),
);

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(formatLog),
);

export function buildWinstonConfig(settings: LoggerSettings): LoggerOptions {
  const activeTransports: transport[] = [
    new transports.Console({
      format: consoleFormat,
    }),
  ];

  if (settings.fileEnabled) {
    activeTransports.push(
      new transports.DailyRotateFile({
        dirname: settings.dir,
        filename: 'backend_%DATE%.log',
        datePattern: 'YYYYMMDD',
        maxSize: '20m',
        maxFiles: '20d',
        format: fileFormat,
      }),
    );
  }

  return {
    level: settings.level,
    transports: activeTransports,
  };
}
