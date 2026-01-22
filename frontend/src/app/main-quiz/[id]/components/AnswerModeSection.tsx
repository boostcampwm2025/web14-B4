'use client';

import { useState } from 'react';
import Recorder from '@/app/main-quiz/[id]/components/Recorder';
import TextAnswer from '@/app/main-quiz/[id]/components/TextAnswer';
import { Button } from '@/components/Button';

type AnswerMode = 'voice' | 'text';

interface Props {
  quizId: number;
}

export default function AnswerModeSection({ quizId }: Props) {
  const [mode, setMode] = useState<AnswerMode | null>(null);

  const modeLabel =
    mode === 'voice' ? '음성 답변 모드' : mode === 'text' ? '텍스트 답변 모드' : null;

  return (
    <>
      {/* 모드 선택 전: 큰 CTA 버튼 */}
      {mode === null && (
        <div className="flex flex-col items-center gap-4 pt-8">
          <Button
            size="cta"
            variant="secondary"
            className="w-[280px]"
            onClick={() => setMode('voice')}
          >
            음성으로 답변하기
          </Button>
          <Button
            size="cta"
            variant="secondary"
            className="w-[280px]"
            onClick={() => setMode('text')}
          >
            텍스트로 답변하기
          </Button>
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

          <div className="pt-6">
            {modeLabel && <p className="sr-only">{modeLabel}</p>}
            {mode === 'voice' ? <Recorder quizId={quizId} /> : <TextAnswer quizId={quizId} />}
          </div>
        </>
      )}
    </>
  );
}
