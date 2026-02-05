import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_SPEECH_SECONDS } from '@/constants/speech.constants';

export function useRecorderTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= MAX_SPEECH_SECONDS) {
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
    isMaximumTime: seconds >= MAX_SPEECH_SECONDS,
    startTimer,
    stopTimer,
    resetTimer,
    maxSeconds: MAX_SPEECH_SECONDS,
  };
}
