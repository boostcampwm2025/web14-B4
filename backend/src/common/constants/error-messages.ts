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

  // DB관련 오류
  // 테이블에서 말하기 연습 관련 데이터를 찾을 수 없는경우
  MAIN_QUIZ_NOT_FOUND: {
    errorCode: 'MAIN_QUIZ_NOT_FOUND',
    status: 404,
    message: '해당 말하기 연습을 찾을 수 없습니다.',
  },
  SOLVED_QUIZ_NOT_FOUND: {
    errorCode: 'SOLVED_QUIZ_NOT_FOUND',
    status: 404,
    message: '해당 말하기 연습 결과 기록을 찾을 수 없습니다.',
  },
  SOLVED_QUIZ_MAIN_QUIZ_MISMATCH: {
    // 무결성 검증
    errorCode: 'SOLVED_QUIZ_MAIN_QUIZ_MISMATCH',
    status: 400,
    message: '해당 말하기 연습과 결과 기록이 일치하지 않습니다.',
  },
};
