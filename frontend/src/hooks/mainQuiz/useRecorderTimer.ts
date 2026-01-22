import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_SECONDS = 60;

export function useRecorderTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= MAX_SECONDS) {
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setSeconds(0);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    seconds,
    isMaximumTime: seconds >= MAX_SECONDS,
    startTimer,
    stopTimer,
    resetTimer,
    maxSeconds: MAX_SECONDS,
  };
}
