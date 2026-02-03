'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quizStore';
import MySpeechText from './MySpeechText';
import { SpeechItemDto } from '@/app/checklist/types/speeches.types';
import { ChecklistItem } from '@/app/checklist/types/checklist.types';
import { Checklist } from './Checklist';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { Button } from '@/components/Button';

interface ChecklistSectionProps {
  mainQuizId: number;
  username: string;
  initialSpeechItem: SpeechItemDto;
  initialChecklistItems: ChecklistItem[];
}

export default function ChecklistSection({
  mainQuizId,
  username,
  initialSpeechItem,
  initialChecklistItems,
}: ChecklistSectionProps) {
  const router = useRouter();
  const {
    solvedQuizId,
    isAnalyzing,
    _hasHydrated,
    actions: { requestAiFeedback },
  } = useQuizStore();
  const resetAnalyzing = useQuizStore((s) => s.resetAnalyzing);

  const [speechItem, setSpeechItem] = useState<SpeechItemDto>(initialSpeechItem);
  const [selectedFeeling, setSelectedFeeling] = useState<'LOW' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [options, setOptions] = useState<ChecklistItem[]>(initialChecklistItems);

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!solvedQuizId || solvedQuizId <= 0) {
      toast.info('푼 퀴즈 정보가 존재하지 않아, 퀴즈 페이지로 이동합니다.', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        theme: 'light',
      });
      router.push(`/quizzes`);
    }
  }, [_hasHydrated, solvedQuizId, router]);

  useEffect(() => {
    return () => {
      resetAnalyzing();
    };
  }, [resetAnalyzing]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    setOptions((prev) =>
      prev.map((option) => (option.id === optionId ? { ...option, checked } : option)),
    );
  };

  const handleResetAndNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = window.confirm('답변을 초기화하고 다시 풀겠습니까?');
    if (confirmed) {
      router.push(`/main-quiz/${mainQuizId}`);
    } else {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const currentText = speechItem.speechText || '';
    if (currentText.trim().length < 50) {
      alert('답변이 너무 짧습니다. 50자 이상 입력해주세요.');
      return;
    }

    const confirmed = window.confirm('답변을 제출하시겠습니까?');
    if (confirmed) {
      const checklistItems = options.map((option) => ({
        checklistItemId: Number(option.id),
        isChecked: option.checked,
      }));

      const requestBody = {
        mainQuizId: Number(mainQuizId),
        solvedQuizId: Number(solvedQuizId),
        speechText: speechItem.speechText,
        comprehensionLevel: selectedFeeling,
        checklistItems: checklistItems,
      };

      const success = await requestAiFeedback(requestBody);

      if (success) {
        router.push(`/feedback/main-quiz/${mainQuizId}/solved-quiz/${solvedQuizId}`);
      } else {
        alert('제출 및 AI 분석에 실패했습니다.');
      }
    }
  };

  return (
    <div className="px-12 py-4 md:px-16 md:py-8 lg:px-24 lg:py-10 xl:px-32">
      {isAnalyzing && (
        <Loader
          message="CS 뽁뽁 생성 중..."
          subMessage="AI 분석이 진행 중입니다. 잠시만 기다려주세요."
        />
      )}
      <div className="flex justify-start px-2 mb-4">
        <div className="inline-block bg-[var(--color-primary)] text-white text-2xl font-medium px-8 py-2 rounded-full mt-1">
          셀프체크
        </div>
      </div>
      {/* 메인 콘텐츠 - 좌우 배치 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* 왼쪽: 나의 답변 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-4 animate-fadeIn flex flex-col">
          <MySpeechText speechItem={speechItem} setSpeechItem={setSpeechItem} />
        </div>

        {/* 오른쪽: 다음 단계 체크리스트 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-4 animate-fadeIn flex flex-col">
          <Checklist
            username={username}
            selectedFeeling={selectedFeeling}
            options={options}
            onFeelingChange={setSelectedFeeling}
            onOptionChange={handleOptionChange}
          />
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="mx-auto mt-8 flex w-full items-center justify-between">
        <Button variant="secondary" size="fixed" onClick={handleResetAndNavigate}>
          다시 풀기
        </Button>

        <Button variant="primary" size="fixed" onClick={handleSubmit}>
          다음
        </Button>
      </div>
    </div>
  );
}
