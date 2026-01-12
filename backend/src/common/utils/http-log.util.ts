export type HttpLog = {
  method: string;
  url: string;
  status: number;
  durationMs?: number;
  errorCode?: string;
  exceptionName?: string;
  exceptionMessage?: string;
};

export function buildHttpLog(data: HttpLog): string {
  const durationPart =
    typeof data.durationMs === 'number'
      ? ` | duration: ${data.durationMs}ms`
      : '';

  const codePart = data.errorCode ? ` | code: ${data.errorCode}` : '';
  const exPart = data.exceptionName ? ` | ex: ${data.exceptionName}` : '';
  const msgPart = data.exceptionMessage
    ? ` | exception: ${data.exceptionMessage}`
    : '';

  return `[${data.method}] ${data.url} | status: ${data.status}${durationPart}${codePart}${exPart}${msgPart}`;
}
