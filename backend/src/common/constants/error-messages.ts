export const ERROR_MESSAGES = {
  // 공통
  API_NOT_FOUND: {
    errorCode: 'API_NOT_FOUND',
    status: 404,
    message: '요청한 API 엔드포인트를 찾을 수 없습니다.',
  },
  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: '서버 내부 처리 중 예상치 못한 오류가 발생했습니다.',
  },
  VALIDATION_FAILED: {
    // 사용자 입력 자체가 API 요청 규격을 벗어난 경우 (유효하지 않은 body) (ValidationPipe)
    errorCode: 'VALIDATION_FAILED',
    status: 400,
    message: '요청 데이터 형식이 올바르지 않습니다.',
  },

  // 말하기 STT
  MISSING_RECORD_FILE: {
    errorCode: 'MISSING_RECORD_FILE',
    message: '요청에 음성 파일이 포함되지 않았습니다.',
    status: 400,
  },
};
