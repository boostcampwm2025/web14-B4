import { format, transports, type LoggerOptions } from 'winston';
import type { TransformableInfo } from 'logform';
import 'winston-daily-rotate-file';

function stringifyMessage(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Error) {
    return value.stack ?? value.message;
  }
  return JSON.stringify(value);
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

export const winstonConfig: LoggerOptions = {
  level: 'debug',
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    new transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'backend_%DATE%.log',
      datePattern: 'YYYYMMDD',
      maxSize: '20m',
      maxFiles: '20d',
      format: fileFormat,
    }),
  ],
};
