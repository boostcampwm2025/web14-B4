interface RecorderTimerProps {
  seconds: number;
  maxSeconds: number;
  isRecording: boolean;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function RecorderTimer({ seconds, maxSeconds, isRecording }: RecorderTimerProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {isRecording ? (
        <div className="rounded-xl text-sm text-red-600 pl-3">녹음 중...</div>
      ) : (
        <div />
      )}

      <div className="text-right pr-1">
        녹음 시간 {formatTime(seconds)} / {formatTime(maxSeconds)}
      </div>
    </div>
  );
}
