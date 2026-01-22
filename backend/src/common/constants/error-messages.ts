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

  // 답변이 너무 짧은 경우 AI 피드백 생성 X
  ANSWER_TOO_SHORT: {
    errorCode: 'ANSWER_TOO_SHORT',
    status: 400,
    message: '답변이 너무 짧습니다. 50자 이상 답변해주세요.',
  },
  // Gemini AI API 관련 오류
  AI_DAILY_QUOTA_EXCEEDED: {
    errorCode: 'AI_DAILY_QUOTA_EXCEEDED',
    status: 429,
    message: '오늘 사용 가능한 AI 요청 횟수를 모두 소모했습니다.',
  },
  AI_RATE_LIMIT_EXCEEDED: {
    errorCode: 'AI_RATE_LIMIT_EXCEEDED',
    status: 429,
    message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  },
  AI_INVALID_REQUEST: {
    errorCode: 'AI_INVALID_REQUEST',
    status: 400,
    message: '지원하지 않는 지역이거나 요청 파라미터가 잘못되었습니다.',
  },
  AI_KEY_INVALID: {
    errorCode: 'AI_KEY_INVALID',
    status: 403,
    message: 'API 키가 유효하지 않거나 권한이 없습니다.',
  },
  AI_SAFETY_BLOCK: {
    errorCode: 'AI_SAFETY_BLOCK',
    status: 400,
    message: '부적절한 내용이 포함되어 AI가 답변을 거부했습니다.',
  },
  AI_SERVER_ERROR: {
    errorCode: 'AI_SERVER_ERROR',
    status: 500,
    message: 'AI 서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },

  // 인증/인가 관련 에러
  ACCESS_DENIED: {
    errorCode: 'ACCESS_DENIED',
    status: 401, // 또는 403
    message: '접근 권한이 없습니다. 로그인 후 이용해주세요.',
  },

  // OAuth 및 인증 관련 에러
  NAVER_TOKEN_FAILED: {
    errorCode: 'NAVER_TOKEN_FAILED',
    status: 401,
    message: '네이버 인증 토큰 발급에 실패했습니다.',
  },
  NAVER_PROFILE_FAILED: {
    errorCode: 'NAVER_PROFILE_FAILED',
    status: 401,
    message: '네이버 프로필 조회에 실패했습니다.',
  },
  REFRESH_TOKEN_INVALID: {
    errorCode: 'REFRESH_TOKEN_INVALID',
    status: 401,
    message: '유효하지 않은 리프레시 토큰입니다. 다시 로그인해주세요.',
  },
  REFRESH_TOKEN_EXPIRED: {
    errorCode: 'REFRESH_TOKEN_EXPIRED',
    status: 401,
    message: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.',
  },
};
