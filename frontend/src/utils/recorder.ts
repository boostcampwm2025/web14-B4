export interface RecorderConfig {
  mimeType: string;
  fileExtension: string;
}

export function getRecorderConfig(): RecorderConfig {
  // Safari는 주로 video/mp4 지원
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    return {
      mimeType: 'video/mp4',
      fileExtension: 'mp4',
    };
  }

  // Chrome, Firefox 등
  const mimeTypes = [
    { type: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { type: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { type: 'video/webm', ext: 'webm' },
    { type: 'video/mp4', ext: 'mp4' },
  ];

  for (const { type, ext } of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return {
        mimeType: type,
        fileExtension: ext,
      };
    }
  }

  return {
    mimeType: '',
    fileExtension: 'webm',
  };
}

// 녹음 파일 config
export function getAudioRecorderConfig(): RecorderConfig {
  const mimeTypes = [
    { type: 'audio/webm;codecs=opus', ext: 'webm' },
    { type: 'audio/webm', ext: 'webm' },
    { type: 'audio/ogg;codecs=opus', ext: 'ogg' },
    { type: 'audio/ogg', ext: 'ogg' },
    { type: 'audio/mp4', ext: 'm4a' },
  ];

  for (const { type, ext } of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return { mimeType: type, fileExtension: ext };
    }
  }

  return { mimeType: '', fileExtension: 'webm' };
}

export function getAudioExtension(mimeType: string): string {
  const normalized = mimeType.split(';')[0].trim();

  switch (normalized) {
    case 'audio/webm':
      return 'webm';
    case 'audio/ogg':
      return 'ogg';
    case 'audio/mp4':
      return 'm4a';
    default:
      return 'webm';
  }
}

export function buildAudioFilename(extension: string): string {
  return `audio.${extension}`;
}
