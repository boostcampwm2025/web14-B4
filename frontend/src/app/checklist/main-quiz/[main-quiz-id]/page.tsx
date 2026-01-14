'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSpeechesByQuizId, updateSpeechText } from '@/services/speechesApi';
import { useQuizStore } from '@/store/quizStore';
import MySpeechText from '../../components/MySpeechText';
import { SpeechItemDto } from '../../types/speeches.types';
import { useRouter } from 'next/navigation';
import { ChecklistItem, ChecklistItemDto } from '../../types/checklist.types';
import { fetchQuizChecklistItems } from '@/services/quizApi';
import { Checklist } from '../../components/checklist';
import { getAIFeedBack, submitSolvedQuiz } from '@/services/feedbackApi';

const DEFAULT_SPEECH_ITEM: SpeechItemDto = {
  solvedQuizId: -1,
  speechText: '답변이 전송되지 않았습니다.',
  createdAt: null,
};

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const mainQuizId = parseInt(params['main-quiz-id'] as string, 10);
  const solvedQuizId = useQuizStore((state) => state.solvedQuizId);
  const { clearSolvedQuizId } = useQuizStore();
  const [speechItem, setSpeechItem] = useState<SpeechItemDto>(DEFAULT_SPEECH_ITEM);
  const [selectedFeeling, setSelectedFeeling] = useState<'LOW' | 'HIGH' | 'NORMAL'>('NORMAL');
  const [options, setOptions] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 음성 녹음 텍스트 불러오기
  useEffect(() => {
    const fetchSpeechData = async () => {
      const LATEST = 0;

      const response = await getSpeechesByQuizId(mainQuizId);

      if (response.speeches && response.speeches.length > 0) {
        const latestSpeech = response.speeches[LATEST];
        setSpeechItem({ ...latestSpeech });
      }
    };
    fetchSpeechData();
  }, []);

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

  // 음성 녹음 텍스트 업데이트
  const handleUpdateSpeech = async () => {
    try {
      if (!speechItem) return;
      await updateSpeechText(mainQuizId, speechItem.solvedQuizId, speechItem.speechText);
      alert('음성 답변이 저장되었습니다!');
      // 다음 페이지로 이동 또는 다른 처리
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
      e.preventDefault(); // 네비게이션 취소
    }
  };

  const handleNewConversion = () => {
    handleUpdateSpeech();
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
        // 성공 시 페이지 이동 등
        router.push('/result');
      } catch (error) {
        console.error('제출 실패:', error);
        alert('제출에 실패했습니다.');
      }
    }
  };

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
        </div>
      </div>
    </div>
  );
}
