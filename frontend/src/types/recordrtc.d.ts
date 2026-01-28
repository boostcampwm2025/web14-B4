declare module 'recordrtc' {
  export interface RecordRTCOptions {
    type: 'audio';
    mimeType?: 'audio/wav'; // WAV로 고정
    recorderType?: unknown;
    numberOfAudioChannels?: 1; // mono (채널을 절반으로 줄여 용량 최적화)
    desiredSampRate?: 16000; // 16kHz 용량 최적화를 위한 샘플레이트 설정
    bufferSize?: number;
  }

  export interface StereoAudioRecorder {
    new (stream: MediaStream, options: RecordRTCOptions): unknown;
  }

  class RecordRTC {
    constructor(stream: MediaStream, options: RecordRTCOptions);
    startRecording(): void;
    stopRecording(cb: () => void): void;
    getBlob(): Blob;
    destroy(): void;

    static StereoAudioRecorder: StereoAudioRecorder;
  }

  export default RecordRTC;
}
