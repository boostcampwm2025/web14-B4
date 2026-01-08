'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MySpeechText from './components/MySpeechText';
import { getSpeechesByQuizId, updateFixedSpeech } from '@/services/speeches';
import { SpeechItemDto } from './types/speeches.types';

const DEFAULT_SPEECH_ITEM: SpeechItemDto = {
  solvedQuizId: -1,
  speechText: '답변이 전송되지 않았습니다.',
  createdAt: null,
};

export default function ResultPage() {
  const [speechItem, setSpeechItem] = useState<SpeechItemDto | null>(DEFAULT_SPEECH_ITEM);
  // 음성 녹음 텍스트 불러오기
  useEffect(() => {
    const fetchSpeechData = async () => {
      const mainQuizId = 1; // TODO: 실제로는 동적으로 가져와야 함
      const LATEST = 0;

      const response = await getSpeechesByQuizId(mainQuizId);

      if (response.speeches && response.speeches.length > 0) {
        const latestSpeech = response.speeches[LATEST];
        setSpeechItem({ ...latestSpeech });
      }
    };
    fetchSpeechData();
  }, []);

  const handleUpdateSpeech = async () => {
    try {
      const mainQuizId = 1; // TODO: 실제로는 동적으로 가져와야 함
      if (!speechItem) return;
      await updateFixedSpeech(mainQuizId, speechItem.solvedQuizId, speechItem.speechText);
      alert('음성 답변이 저장되었습니다!');
      // 다음 페이지로 이동 또는 다른 처리
    } catch (error) {
      const message = error instanceof Error ? error.message : '음성 답변 저장에 실패했습니다.';
      alert(message);
      console.error('Failed to update speech:', error);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('audioResult');
    }
    setSpeechItem({ text: '답변이 전송되지 않았습니다...' });
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
    handleUpdateSpeech();
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
              <h3
                className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2"
                style={{ color: '#4278FF' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                체크리스트
              </h3>

              <div className="space-y-4 md:space-y-6 flex-grow">
                <div className="bg-blue-50 rounded-xl p-4 md:p-6 border-2 border-blue-100 hover:border-blue-300 transition">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4278FF' }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                        {' '}
                        스택이 후입선출(LIFO) 구조임을 명확히 설명했다
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 md:p-6 border-2 border-blue-100 hover:border-blue-300 transition">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4278FF' }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                        {' '}
                        스택이 후입선출(LIFO) 구조임을 명확히 설명했다
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 md:p-6 border-2 border-blue-100 hover:border-blue-300 transition">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4278FF' }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                        {' '}
                        스택이 후입선출(LIFO) 구조임을 명확히 설명했다
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 md:p-6 border-2 border-blue-100 hover:border-blue-300 transition">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4278FF' }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                        {' '}
                        스택이 후입선출(LIFO) 구조임을 명확히 설명했다
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 md:p-6 border-2 border-blue-100 hover:border-blue-300 transition">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4278FF' }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-base md:text-lg">
                        {' '}
                        스택이 후입선출(LIFO) 구조임을 명확히 설명했다
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
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
