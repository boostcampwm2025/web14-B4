'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChecklistItem, ChecklistItemDto, QuizChecklistResponseDto } from './types/checklist.types';
import { fetchQuizChecklistItems } from '@/services/quizApi';
import { Checklist } from './components/checklist';
import MySpeechText from './components/MySpeechText';

interface STTResponse {
  text: string;
}

export default function ResultPage() {
  const mainQuizId = 1;
  const [selectedFeeling, setSelectedFeeling] = useState<'bad' | 'normal' | 'good'>('normal');
  const [options, setOptions] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // API에서 체크리스트 아이템 가져오기
  useEffect(() => {
    const loadChecklistItems = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizChecklistItems(mainQuizId);

        if (data && data.checklistItems) {
          // API 응답을 ChecklistItem 형식으로 변환
          const items: ChecklistItem[] = data.checklistItems.map((item: ChecklistItemDto) => ({
            id: item.checklistItemId,
            content: item.content,
            checked: false, // 초기값은 모두 체크 해제
          }));
          setOptions(items);
        }
      } catch (error) {
        console.error('체크리스트 로딩 실패:', error);
        // 에러 발생 시 기본 데이터 유지 (선택사항)
      } finally {
        setLoading(false);
      }
    };

    loadChecklistItems();
  }, [mainQuizId]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    setOptions((prev) =>
      prev.map((option) => (option.id === optionId ? { ...option, checked } : option)),
    );
  };

  const [result, setResult] = useState<STTResponse | null>(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      const savedResult = localStorage.getItem('audioResult');
      if (savedResult) {
        return JSON.parse(savedResult);
      }
    }
    return { text: '답변이 전송되지 않았습니다.' };
  });

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('audioResult');
    }
    setResult({ text: '답변이 전송되지 않았습니다.' });
  };

  const handleResetAndNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const confirmed = window.confirm('답변을 초기화하고 다시 풀겠습니까?');
    if (confirmed) {
      handleReset();
    } else {
      e.preventDefault(); // 네비게이션 취소
    }
  };

  const handleNewConversion = () => {
    alert('생각 톡톡으로 이동 !');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto mb-4"
            style={{ color: '#4278FF' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="px-12 py-12">
        <div className="max-w-[1600px] mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-2 animate-fadeIn">
              스택(Stack)과 큐(Queue)는 각각 어떤 구조이며, 언제 사용하나요?
            </h3>
          </div>

          {/* 메인 콘텐츠 - 좌우 배치 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* 왼쪽: 나의 답변 */}
            <MySpeechText result={result} />

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
              onClick={handleNewConversion}
              className="flex-1 py-3 md:py-4 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 text-sm md:text-base"
              style={{ backgroundColor: '#4278FF' }}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
