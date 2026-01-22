'use client';

import { ImportanceItem } from '../../types/importanceItem';
import { ImportanceGroup } from './ImportanceGroup';

const mockData: {
  high: ImportanceItem[];
  normal: ImportanceItem[];
  low: ImportanceItem[];
} = {
  high: [
    {
      solvedQuizId: 1,
      category: '네트워크',
      mainQuizId: 2,
      mainQuizTitle: 'TCP 3-Way Handshake',
      createdAt: '2026-01-21T09:12:34Z',
    },
    {
      solvedQuizId: 5,
      category: '운영체제',
      mainQuizId: 7,
      mainQuizTitle: '프로세스와 스레드의 차이',
      createdAt: '2026-01-20T15:41:10Z',
    },
  ],
  normal: [
    {
      solvedQuizId: 8,
      category: '데이터베이스',
      mainQuizId: 12,
      mainQuizTitle: '인덱스의 동작 원리',
      createdAt: '2026-01-18T11:05:22Z',
    },
    {
      solvedQuizId: 10,
      category: 'Java',
      mainQuizId: 14,
      mainQuizTitle: 'JVM 메모리 구조',
      createdAt: '2026-01-17T20:30:55Z',
    },
  ],
  low: [],
};

export default function ImportanceBoard() {
  return (
    <div className="mt-30 mb-50 bg-slate-100">
      <div className="mb-6 flex items-center">
        <span className="rounded-full bg-blue-500 px-4 py-1.5 text-xl text-white shadow-md">
          중요도별 분석
        </span>
      </div>

      <div className="rounded-2xl bg-white shadow-sm divide-y py-3 px-10 divide-slate-300">
        <ImportanceGroup title="중요도 상" items={mockData.high} />
        <ImportanceGroup title="중요도 중" items={mockData.normal} />
        <ImportanceGroup title="중요도 하" items={mockData.low} />
      </div>
    </div>
  );
}
