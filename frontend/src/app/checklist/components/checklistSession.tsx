'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateSpeechText } from '@/services/speechesApi';
import { useQuizStore } from '@/store/quizStore';
import MySpeechText from './MySpeechText';
import { SpeechItemDto } from '@/app/checklist/types/speeches.types';
import { ChecklistItem } from '@/app/checklist/types/checklist.types';
import { Checklist } from './checklist';
import { getAIFeedBack, submitSolvedQuiz } from '@/services/feedbackApi';

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
  const solvedQuizId = useQuizStore((state) => state.solvedQuizId);
  const { clearSolvedQuizId } = useQuizStore();

  const [speechItem, setSpeechItem] = useState<SpeechItemDto>(initialSpeechItem);
  const [selectedFeeling, setSelectedFeeling] = useState<'LOW' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [options, setOptions] = useState<ChecklistItem[]>(initialChecklistItems);

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

      try {
        const result = await submitSolvedQuiz(requestBody);
        await getAIFeedBack(result);
        router.push('/result');
      } catch (error) {
        console.error('제출 실패:', error);
        alert('제출에 실패했습니다.');
      }
    }
  };

  return (
    <>
      {/* 메인 콘텐츠 - 좌우 배치 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* 왼쪽: 나의 답변 */}
        <MySpeechText speechItem={speechItem} setSpeechItem={setSpeechItem} />

        {/* 오른쪽: 다음 단계 체크리스트 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fadeIn flex flex-col">
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
    </>
  );
}
