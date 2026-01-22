'use client';

import { Importance } from '@/types/solvedQuiz.types';
import { ImportanceGroup } from './ImportanceGroup';

export interface Item {
  id: string;
  name: string;
  importance: Importance;
}

/** 더미 데이터 */
const items: Item[] = [
  { id: 'Q.01', name: '문항 A', importance: 'HIGH' },
  { id: 'Q.02', name: '문항 B', importance: 'HIGH' },
  { id: 'Q.03', name: '문항 C', importance: 'HIGH' },

  { id: 'Q.04', name: '문항 D', importance: 'NORMAL' },
  { id: 'Q.05', name: '문항 E', importance: 'NORMAL' },

  { id: 'Q.06', name: '문항 F', importance: 'LOW' },
];

const grouped = {
  high: items.filter((i) => i.importance === 'HIGH'),
  medium: items.filter((i) => i.importance === 'NORMAL'),
  low: items.filter((i) => i.importance === 'LOW'),
};

export default function ImportanceBoard() {
  return (
    <div className=" bg-slate-100 mt-30 mb-50">
      <div className="mb-6 flex items-center">
        <span className="rounded-full shadow-md bg-blue-500 px-4 py-1.5 text-xl text-white">
          중요도별 분석
        </span>
      </div>

      <ImportanceGroup title="중요도 상" importance="HIGH" items={grouped.high} />
      <ImportanceGroup title="중요도 중" importance="NORMAL" items={grouped.medium} />
      <ImportanceGroup title="중요도 하" importance="LOW" items={grouped.low} />
    </div>
  );
}
