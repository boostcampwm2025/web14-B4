'use client';

import { useEffect, useRef } from 'react';
import { useRecorderTimer } from '@/hooks/mainQuiz/useRecorderTimer';
import RecorderTimer from './RecorderTimer';

type Props = {
  isRecording: boolean;
  onTimeout: () => void;
};

export default function RecorderTimerContainer({ isRecording, onTimeout }: Props) {
  const timer = useRecorderTimer();
  const hasTimedOutRef = useRef(false);

  useEffect(() => {
    if (isRecording === true) {
      timer.startTimer();
      return () => {
        timer.stopTimer();
      };
    }

    // 녹음 종료시 다음 녹음을 위해 타이머 상태 초기화
    hasTimedOutRef.current = false;
    timer.resetTimer();
  }, [isRecording, timer.startTimer, timer.stopTimer, timer.resetTimer]);

  useEffect(() => {
    if (isRecording === false) {
      return;
    }

    if (timer.isMaximumTime === false) {
      return;
    }

    if (hasTimedOutRef.current === true) {
      return;
    }

    hasTimedOutRef.current = true;
    onTimeout();
  }, [isRecording, timer.isMaximumTime, onTimeout]);

  return (
    <RecorderTimer
      seconds={timer.seconds}
      maxSeconds={timer.maxSeconds}
      isRecording={isRecording}
    />
  );
}
