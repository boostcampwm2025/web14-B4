'use client';

import { useState } from 'react';
import Image from 'next/image';
import Recorder from '@/app/main-quiz/[id]/components/Recorder';
import TextAnswer from '@/app/main-quiz/[id]/components/TextAnswer';
import { Button } from '@/components/Button';

type AnswerMode = 'voice' | 'text';

interface Props {
  quizId: number;
}

interface CardButtonProps {
  iconSrc: string;
  label: string;
  onClick: () => void;
}

function CardButton({ iconSrc, label, onClick }: CardButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="
        group relative w-44 h-44 rounded-3xl
        bg-white
        border-2 border-[var(--color-primary)]
        transition-all duration-300
        hover:bg-[var(--color-accent-sky)]
        active:scale-95
        cursor-pointer
        flex flex-col items-center justify-center gap-3
      "
    >
      {/* hover 시 아이콘 배경 white */}
      <div
        className="
          flex items-center justify-center
          w-20 h-20 rounded-full
          transition-colors duration-300
          group-hover:bg-white
        "
      >
        <Image
          src={iconSrc}
          alt={label}
          width={55}
          height={55}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <span className="text-sm text-gray-800">{label}</span>
    </div>
  );
}

export default function AnswerModeSection({ quizId }: Props) {
  const [mode, setMode] = useState<AnswerMode | null>(null);

  const modeLabel =
    mode === 'voice' ? '음성 답변 모드' : mode === 'text' ? '텍스트 답변 모드' : null;

  return (
    <>
      {/* 모드 선택 전: 카드 CTA */}
      {mode === null && (
        <div className="flex justify-center gap-8 pt-10">
          <CardButton
            iconSrc="/icons/icon-recorder.svg"
            label="음성으로 답변하기"
            onClick={() => setMode('voice')}
          />
          <CardButton
            iconSrc="/icons/icon-text.svg"
            label="텍스트로 답변하기"
            onClick={() => setMode('text')}
          />
        </div>
      )}

      {/* 모드 선택 후: 토글 버튼 + 선택한 모드 렌더링 */}
      {mode !== null && (
        <>
          <div className="flex justify-center pt-4">
            <div className="flex gap-2">
              <Button
                size="cta"
                variant={mode === 'voice' ? 'primary' : 'secondary'}
                onClick={() => setMode('voice')}
                aria-pressed={mode === 'voice'}
              >
                음성 답변 모드
              </Button>
              <Button
                size="cta"
                variant={mode === 'text' ? 'primary' : 'secondary'}
                onClick={() => setMode('text')}
                aria-pressed={mode === 'text'}
              >
                텍스트 답변 모드
              </Button>
            </div>
          </div>

          <div className="pt-6 flex justify-center">
            {modeLabel && <p className="sr-only">{modeLabel}</p>}
            {mode === 'voice' ? <Recorder quizId={quizId} /> : <TextAnswer quizId={quizId} />}
          </div>
        </>
      )}
    </>
  );
}
