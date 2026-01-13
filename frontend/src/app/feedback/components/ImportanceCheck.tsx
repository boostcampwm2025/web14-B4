'use client';

import Image from 'next/image';
import * as React from 'react';
import { Button } from '@/components/Button';

type Importance = 'LOW' | 'MEDIUM' | 'HIGH';

type Option = {
  value: Importance;
  label: string;
  graySrc: string;
  blueSrc: string;
};

const OPTIONS: Option[] = [
  {
    value: 'LOW',
    label: '이미 알고 있었거나\n흥미 분야가 아니에요',
    graySrc: '/images/bad-gray.png',
    blueSrc: '/images/bad-blue.png',
  },
  {
    value: 'MEDIUM',
    label: '보통이에요',
    graySrc: '/images/normal-gray.png',
    blueSrc: '/images/normal-blue.png',
  },
  {
    value: 'HIGH',
    label: '더 공부해보고 싶어요',
    graySrc: '/images/good-gray.png',
    blueSrc: '/images/good-blue.png',
  },
];

type Props = {
  userName?: string;
};

export default function ImportanceCheck({ userName = '철수' }: Props) {
  const [hovered, setHovered] = React.useState<Importance | null>(null);
  const [selected, setSelected] = React.useState<Importance | null>(null);

  const getSrc = (opt: Option) => {
    const isActive = hovered === opt.value || selected === opt.value;
    return isActive ? opt.blueSrc : opt.graySrc;
  };

  const handleRetry = async () => {
    // TODO
    // 말하기 연습 화면 이동 처리
  };

  const handleFinish = async () => {
    if (!selected) {
      return;
    }
    // TODO
    // 중요도 저장 API 호출
    // 이후 페이지 이동 처리
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[980px] rounded-2xl bg-white px-8 py-10 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <h2 className="text-xl font-bold text-[var(--color-primary)]">
          🤓 {userName}님에게 얼마나 중요한 지식인가요?
        </h2>

        <div className="mt-10 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-16">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                className="group flex w-[180px] cursor-pointer flex-col items-center rounded-2xl p-4"
                onMouseEnter={() => setHovered(opt.value)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(opt.value)}
                aria-pressed={isSelected}
              >
                <Image
                  src={getSrc(opt)}
                  alt={`${opt.value} 중요도`}
                  width={94}
                  height={93}
                  priority
                />

                <p
                  className={[
                    'mt-5 whitespace-pre-line text-center text-sm font-medium transition-colors',
                    isSelected
                      ? 'text-[var(--color-primary)]'
                      : 'text-gray-600 group-hover:text-[var(--color-primary)]',
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
        <Button variant="secondary" size="fixed" onClick={handleRetry}>
          다시 풀기
        </Button>

        <Button variant="primary" size="fixed" onClick={handleFinish} disabled={!selected}>
          끝내기
        </Button>
      </div>
    </section>
  );
}
