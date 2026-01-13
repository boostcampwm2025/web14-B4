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
