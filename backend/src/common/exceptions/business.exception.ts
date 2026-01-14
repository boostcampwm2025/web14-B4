import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(error: { errorCode: string; message: string; status: number }) {
    super(
      {
        errorCode: error.errorCode,
        message: error.message,
      },
      error.status,
    );
  }
}
