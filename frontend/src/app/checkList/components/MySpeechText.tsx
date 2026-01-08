'use client';

interface MySpeechTextProps {
  result: {
    text: string;
  };
}

export default function MySpeechText({ result }: MySpeechTextProps) {
  return (
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
        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">{result.text}</p>
      </div>
    </div>
  );
}
