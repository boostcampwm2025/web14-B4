export type HttpLogBase = {
  method: string;
  url: string;
  status: number;
  durationMs?: number;
};

export type HttpErrorLog = HttpLogBase & {
  errorCode?: string;
  exceptionName?: string;
  exceptionMessage?: string;
};

export function buildHttpAccessLog(data: HttpLogBase): string {
  const durationPart =
    typeof data.durationMs === 'number'
      ? ` | duration: ${data.durationMs}ms`
      : '';

  return `[${data.method}] ${data.url} | status: ${data.status}${durationPart}`;
}

export function buildHttpErrorLog(data: HttpErrorLog): string {
  const durationPart =
    typeof data.durationMs === 'number'
      ? ` | duration: ${data.durationMs}ms`
      : '';

  const codePart = data.errorCode ? ` | code: ${data.errorCode}` : '';
  const exPart = data.exceptionName
    ? ` | exception: ${data.exceptionName}`
    : '';
  const msgPart = data.exceptionMessage
    ? ` | msg: ${data.exceptionMessage}`
    : '';

  return `[${data.method}] ${data.url} | status: ${data.status}${durationPart}${codePart}${exPart}${msgPart}`;
}
