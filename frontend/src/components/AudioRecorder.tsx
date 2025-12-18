"use client";

import { useRef, useState } from "react";

export default function AudioRecorder() {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const startRecording = async () => {
    // 마이크 권한 요청
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];
    setAudioUrl(null);

    // 녹음 데이터 수집
    recorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      // 브라우저에서 재생 가능한 URL 생성
      setAudioUrl((prev) => {
        if (prev) {
          URL.revokeObjectURL(prev); // 이전 URL 삭제 (메모리 누수 방지)
        }
        return URL.createObjectURL(blob);
      });
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    audioStreamRef.current?.getTracks().forEach((t) => t.stop()); // 오디오 스트림 종료
    setIsRecording(false);
  };

  return (
    <div>
      {!isRecording ? (
        <button onClick={startRecording}>녹음 시작</button>
      ) : (
        <button onClick={stopRecording}>녹음 완료</button>
      )}

      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}
