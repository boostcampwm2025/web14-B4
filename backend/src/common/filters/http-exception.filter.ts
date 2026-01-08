import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ERROR_MESSAGES } from '../constants/error-messages';

// NestJS 내장 에러 응답 객체 구조 정의 (any 방지용)
interface ErrorResponseObject {
  message?: string | string[];
  errorCode?: string;
  statusCode?: number;
}
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // 에러 데이터 추출 (기본값은 500)
    let status: number;
    let errorCode: string;
    let message: string;
    let data: unknown = null;

    if (exception instanceof HttpException) {
      // NestJS 내장 예외 (400, 401, 403, 404 등) 및 BusinessException
      status = exception.getStatus();
      const resBody = exception.getResponse() as ErrorResponseObject;

      if (
        exception instanceof BadRequestException &&
        Array.isArray(resBody?.message)
      ) {
        // DTO 유효성 검증 실패 (ValidationPipe)
        errorCode = ERROR_MESSAGES.VALIDATION_FAILED.errorCode;
        message = ERROR_MESSAGES.VALIDATION_FAILED.message;
        data = resBody.message;
      } else {
        // 정의한 비즈니스 에러 또는 표준 HTTP 에러
        errorCode = resBody?.errorCode ?? `HTTP_${status}`;
        message =
          typeof resBody?.message === 'string'
            ? resBody.message
            : exception.message || '알 수 없는 요청 오류가 발생했습니다.';
      }
    } else {
      // 시스템에서 발생한 예상치 못한 예외 (DB 에러, 네트워크 에러 등)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = ERROR_MESSAGES.INTERNAL_SERVER_ERROR.errorCode;
      message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message;
    }

    const logMessage = `[${req.method}] ${req.originalUrl} | status: ${status} | code: ${errorCode}`;
    if (status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(logMessage);
    }

    // 공통 응답 조립
    const errorResponse: ApiResponse = {
      success: false,
      message,
      errorCode,
      data,
    };

    res.status(status).json(errorResponse);
  }
}
