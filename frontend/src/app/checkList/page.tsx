'use client';

import { useState } from 'react';
import Link from 'next/link';

interface STTResponse {
  text: string;
}

export default function ResultPage() {
<<<<<<< HEAD
  const [result, setResult] = useState<STTResponse | null>(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      const savedResult = localStorage.getItem('audioResult');
      if (savedResult) {
        return JSON.parse(savedResult);
      }
=======
    const [result, setResult] = useState<STTResponse | null>(null);
    const router = useRouter();
    useEffect(() => {
        // localStorage에서 결과 가져오기
        const savedResult = localStorage.getItem('audioResult');
        if (savedResult) {
            setResult(JSON.parse(savedResult));
        } else {
            setResult({text: '답변이 전송되지 않았습니다.'});
        }
    }, [router]);

    const handleCopy = () => {
        if (result?.text) {
            navigator.clipboard.writeText(result.text);
            alert('텍스트가 복사되었습니다!');
        }
    };

    const handleNewConversion = () => {
        alert('생각 톡톡으로 이동하기!');
    };

    if (!result) {
        return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto mb-4" style={{ color: '#4278FF' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">로딩 중...</p>
            </div>
        </div>
        );
>>>>>>> 6587e24 (test: ci 테스트 프론트엔드 부분 변경 시에 제대로 동작하는지 확인)
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
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span>나의 답변</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{result.text.length}자</span>
                </div>
              </div>

              <div
                className="rounded-xl p-6 border-2 mb-6 min-h-[500px]"
                style={{ backgroundColor: '#4278FF10', borderColor: '#4278FF' }}
              >
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {result.text}
                </p>
              </div>
            </div>

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
