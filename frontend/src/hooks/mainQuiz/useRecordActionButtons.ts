import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RecordStatus } from '@/app/main-quiz/[id]/components/Recorder';

export type ActionButton = {
  label: string;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
};

type Params = {
  recordStatus: RecordStatus;
  canRecord: boolean;

  onStart: () => void;
  onStop: () => void;
  onRetry: () => void;
  onSubmit: () => void;
  onExit: () => void;
};

export function useRecordActionButtons({
  recordStatus,
  canRecord,
  onStart,
  onStop,
  onRetry,
  onSubmit,
  onExit,
}: Params) {
  const router = useRouter();

  const actionButtonsByStatus: Record<RecordStatus, ActionButton[]> = useMemo(
    () => ({
      idle: [
        {
          label: '말하기',
          variant: 'primary',
          onClick: onStart,
          disabled: !canRecord,
        },
        {
          label: '나가기',
          variant: 'secondary',
          onClick: onExit,
        },
      ],

      recording: [
        {
          label: '말하기 종료',
          variant: 'primary',
          onClick: onStop,
        },
        {
          label: '나가기',
          variant: 'secondary',
          onClick: onExit,
        },
      ],

      recorded: [
        {
          label: '다시하기',
          variant: 'secondary',
          onClick: onRetry,
        },
        {
          label: '제출',
          variant: 'primary',
          onClick: onSubmit,
        },
        {
          label: '나가기',
          variant: 'secondary',
          onClick: onExit,
        },
      ],

      submitting: [
        {
          label: '다시하기',
          variant: 'secondary',
          disabled: true,
        },
        {
          label: '제출중...',
          variant: 'primary',
          disabled: true,
        },
        {
          label: '나가기',
          variant: 'secondary',
          disabled: true,
        },
      ],
    }),
    [canRecord, onStart, onStop, onRetry, onSubmit, onExit, router],
  );

  return actionButtonsByStatus[recordStatus];
}
