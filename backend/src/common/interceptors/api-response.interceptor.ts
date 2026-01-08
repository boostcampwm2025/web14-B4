import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponse } from '../interface/api-response.interface';

/**
 * 공통 응답 반환 interceptor
 */

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  CommonResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: '성공적으로 처리되었습니다.',
        errorCode: null,
        data,
      })),
    );
  }
}
