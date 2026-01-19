interface RecorderTimerProps {
  seconds: number;
  maxSeconds: number;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function RecorderTimer({ seconds, maxSeconds }: RecorderTimerProps) {
  return (
    <div className="text-lg font-semibold">
      {formatTime(seconds)} / {formatTime(maxSeconds)}
    </div>
  );
}
