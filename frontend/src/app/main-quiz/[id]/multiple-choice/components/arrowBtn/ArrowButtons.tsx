'use client';

import Image from 'next/image';

interface ArrowButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const baseClass =
  'fixed top-1/2 -translate-y-1/2 z-50 rounded-full p-1 transition-all duration-200 cursor-pointer';

const hoverClass = 'hover:scale-110 hover:bg-blue-100 hover:shadow-md';

const disabledClass =
  'disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:cursor-default';

export default function ArrowButtons({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: ArrowButtonsProps) {
  return (
    <>
      {/* 왼쪽 */}
      <button
        onClick={onPrev}
        disabled={disablePrev}
        className={`${baseClass} left-6 ${hoverClass} ${disabledClass}`}
      >
        <Image src="/images/left-arrow.svg" alt="이전 문제" width={40} height={40} />
      </button>

      {/* 오른쪽 */}
      <button
        onClick={onNext}
        disabled={disableNext}
        className={`${baseClass} right-6 ${hoverClass} ${disabledClass}`}
      >
        <Image src="/images/right-arrow.svg" alt="다음 문제" width={40} height={40} />
      </button>
    </>
  );
}
