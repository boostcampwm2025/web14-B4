'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/Button';
import type { Importance } from '@/types/solvedQuiz.types.ts';
import { postImportance } from '@/services/apis/usersApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Option = {
  value: Importance;
  label: string;
  src: string;
};

const OPTIONS: Option[] = [
  {
    value: 'LOW',
    label: '이미 알고 있었거나\n흥미 분야가 아니에요',
    src: '/images/low-blue.svg',
  },
  {
    value: 'NORMAL',
    label: '보통이에요',
    src: '/images/normal-blue.svg',
  },
  {
    value: 'HIGH',
    label: '더 공부해보고 싶어요',
    src: '/images/high-blue.svg',
  },
];

type Mode = 'default' | 'report';

type Props = {
  userName: string;
  mainQuizId: number;
  solvedQuizId: number;
  importance: Importance;
  mode?: Mode;
};

export default function ImportanceCheck({
  userName,
  mainQuizId,
  solvedQuizId,
  importance,
  mode,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<Importance | null>(importance);
  const [isSaving, setIsSaving] = useState(false);

  const currentMode: Mode = mode ?? 'default';

  const handleRetry = () => {
    if (isSaving) {
      // 저장중 이탈 방지
      return;
    }
    router.push(`/main-quiz/${mainQuizId}`);
  };

  const handleFinish = async () => {
    if (!selected || isSaving) {
      return;
    }

    const ok = window.confirm('피드백 확인을 마치고 퀴즈 목록으로 이동합니다.');
    if (!ok) {
      return;
    }

    setIsSaving(true);

    try {
      await postImportance({
        mainQuizId,
        solvedQuizId,
        importance: selected,
      });

      router.push('/quizzes');
    } catch (e) {
      toast.error('중요도 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoReport = () => {
    router.push('/user');
  };

  const modeConfig = {
    default: {
      buttonText: '저장하고 다른 퀴즈 풀기',
      onClick: handleFinish,
      showRetry: true,
      selectable: true,
    },
    report: {
      buttonText: '리포트로 돌아가기',
      onClick: handleGoReport,
      showRetry: false,
      selectable: false,
    },
  } satisfies Record<
    Mode,
    { buttonText: string; onClick: () => void; showRetry: boolean; selectable: boolean }
  >;

  const config = modeConfig[currentMode];

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-8 mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl">
              🤓
            </div>
            <h2 className="text-lg font-bold tracking-tight text-(--color-accent-navy)">
              {userName}님에게 얼마나 중요한 지식인가요?
            </h2>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-16">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                disabled={!config.selectable}
                className={[
                  'group flex w-[180px] flex-col items-center rounded-2xl',
                  config.selectable ? 'cursor-pointer hover:scale-110' : 'cursor-default',
                ].join(' ')}
                onClick={() => {
                  if (!config.selectable) return;
                  setSelected((prev) => (prev === opt.value ? null : opt.value));
                }}
                aria-pressed={isSelected}
              >
                <Image
                  src={opt.src}
                  alt={`${opt.value} 중요도`}
                  width={94}
                  height={93}
                  priority
                  className={[
                    'object-contain transition-all',
                    isSelected
                      ? 'grayscale-0 opacity-100'
                      : config.selectable
                        ? 'grayscale brightness-90 contrast-125 opacity-80 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:opacity-100'
                        : 'grayscale',
                  ].join(' ')}
                />

                <p
                  className={[
                    'mt-5 whitespace-pre-line text-center text-sm font-medium transition-colors',
                    isSelected
                      ? 'text-[var(--color-primary)]'
                      : config.selectable
                        ? 'text-gray-600 group-hover:text-[var(--color-primary)]'
                        : 'text-gray-600',
                  ].join(' ')}
                >
                  {opt.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[980px] items-center justify-between">
        <div>
          {config.showRetry && (
            <Button variant="secondary" size="fixed" onClick={handleRetry}>
              다시 풀기
            </Button>
          )}
        </div>

        <Button variant="primary" size="cta" onClick={config.onClick} disabled={!selected}>
          {config.buttonText}
        </Button>
      </div>
    </section>
  );
}
