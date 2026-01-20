'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateSpeechText } from '@/services/apis/speechesApi';
import { useQuizStore } from '@/store/quizStore';
import MySpeechText from './MySpeechText';
import { SpeechItemDto } from '@/app/checklist/types/speeches.types';
import { ChecklistItem } from '@/app/checklist/types/checklist.types';
import { Checklist } from './checklist';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';

interface ChecklistSessionProps {
  mainQuizId: number;
  initialSpeechItem: SpeechItemDto;
  initialChecklistItems: ChecklistItem[];
}

export default function ChecklistSession({
  mainQuizId,
  initialSpeechItem,
  initialChecklistItems,
}: ChecklistSessionProps) {
  const router = useRouter();
  const {
    solvedQuizId,
    isAnalyzing,
    actions: { requestAiFeedback },
  } = useQuizStore();
  const { clearSolvedQuizId } = useQuizStore();

  const [speechItem, setSpeechItem] = useState<SpeechItemDto>(initialSpeechItem);
  const [selectedFeeling, setSelectedFeeling] = useState<'LOW' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [options, setOptions] = useState<ChecklistItem[]>(initialChecklistItems);

  useEffect(() => {
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
  }, [solvedQuizId, router]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    setOptions((prev) =>
      prev.map((option) => (option.id === optionId ? { ...option, checked } : option)),
    );
  };

  const handleUpdateSpeech = async () => {
    try {
      if (!speechItem) return;
      await updateSpeechText(mainQuizId, speechItem.solvedQuizId, speechItem.speechText);
      alert('음성 답변이 저장되었습니다!');
    } catch (error) {
      const message = error instanceof Error ? error.message : '음성 답변 저장에 실패했습니다.';
      alert(message);
      console.error('Failed to update speech:', error);
    }
  };

  const handleResetAndNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const confirmed = window.confirm('답변을 초기화하고 다시 풀겠습니까?');
    if (confirmed) {
      clearSolvedQuizId();
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
    <div className="px-12 py-12 md:px-16 md:py-16 lg:px-24 lg:py-24 xl:px-32">
      {isAnalyzing && (
        <Loader
          message="CS 뽁뽁 생성 중..."
          subMessage="AI 분석이 진행 중입니다. 잠시만 기다려주세요."
        />
      )}
      {/* 메인 콘텐츠 - 좌우 배치 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* 왼쪽: 나의 답변 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-4 animate-fadeIn flex flex-col">
          <MySpeechText speechItem={speechItem} setSpeechItem={setSpeechItem} />
        </div>

        {/* 오른쪽: 다음 단계 체크리스트 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-4 animate-fadeIn flex flex-col">
          <Checklist
            username="철수"
            selectedFeeling={selectedFeeling}
            options={options}
            onFeelingChange={setSelectedFeeling}
            onOptionChange={handleOptionChange}
          />
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-4xl mx-auto">
        <Link
          href="/practice"
          onClick={handleResetAndNavigate}
          className="flex-1 py-3 md:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition text-center flex items-center justify-center gap-2 text-sm md:text-base"
        >
          다시풀기
        </Link>
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 md:py-4 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm md:text-base"
          style={{ backgroundColor: '#4278FF' }}
        >
          다음
        </button>
      </div>
    </div>
  );
}
