export type LoggerSettings = {
  level: string;
  dir: string;
  fileEnabled: boolean;
};

function parseBool(value: string | undefined): boolean {
  if (value === '1') {
    return true;
  }
  if (value === 'true' || value === 'TRUE') {
    return true;
  }
  return false;
}

export function getLoggerSettings(): LoggerSettings {
  return {
    level: process.env.LOG_LEVEL ?? 'debug',
    dir: process.env.LOG_DIR ?? 'logs',
    fileEnabled: parseBool(process.env.LOG_TO_FILE ?? 'false'),
  };
}
