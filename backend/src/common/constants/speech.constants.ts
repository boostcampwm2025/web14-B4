export const MAX_USER_ANSWER_LENGTH = 1500; // 말하기 연습 텍스트 답변 최대 글자수 제한 (3분 기준 1200자 내외 + 버퍼 300자)
export const MIN_USER_ANSWER_LENGTH = 50; // 말하기 연습 텍스트 답변 최소 글자수 제한

// 녹음 파일 MIME 타입
export const allowedMimeTypes = [
  'audio/wav',
  'audio/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
];

export const AUDIOFILE_MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB = 3분 wav 파일 약 6MB + 버퍼 2MB
