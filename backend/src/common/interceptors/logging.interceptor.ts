import {
  Injectable,
  Inject,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import type { Request, Response } from 'express';
import { buildHttpAccessLog } from '../utils/log-print.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const { method, originalUrl } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        //tap: 값을 바꾸지 않고, 성공 / 에러 시점에 사이드 이펙트(로그 등) 만 수행
        next: () => {
          const durationMs = Date.now() - start;

          this.logger.log(
            buildHttpAccessLog({
              method,
              url: originalUrl,
              status: res.statusCode,
              durationMs,
            }),
            LoggingInterceptor.name,
          );
        },
      }),
    );
  }
}
