// 녹음 파일 MIME 타입
export const allowedMimeTypes = [
  'audio/wav',
  'audio/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
];

// 외부 url
export const CLOVA_STT = {
  BASE_URL: 'https://naveropenapi.apigw.ntruss.com/recog/v1/stt',
  DEFAULT_LANG: 'Kor',
};

export const AUDIOFILE_MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB = 3분 wav 파일 약 6MB + 버퍼 2MB
