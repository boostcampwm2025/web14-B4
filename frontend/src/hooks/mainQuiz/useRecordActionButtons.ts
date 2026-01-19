import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RecordStatus } from '@/app/main-quiz/[id]/components/AudioRecorder';

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
};

export function useRecordActionButtons({
  recordStatus,
  canRecord,
  onStart,
  onStop,
  onRetry,
  onSubmit,
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
          onClick: () => router.push('/'),
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
          onClick: () => router.push('/'),
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
          onClick: () => router.push('/'),
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
    [canRecord, onStart, onStop, onRetry, onSubmit, router],
  );

  return actionButtonsByStatus[recordStatus];
}
