'use client';

import { useEffect, useState } from 'react';
import { ImportanceData } from '../../types/importanceItem';
import { ImportanceGroup } from './ImportanceGroup';
import { fetchSolvedImportance } from '@/services/apis/usersApi';

export default function ImportanceBoard() {
  const [importanceData, setImportanceData] = useState<ImportanceData>({
    high: [],
    normal: [],
    low: [],
  });

  useEffect(() => {
    const loadImportanceData = async () => {
      try {
        const data = await fetchSolvedImportance();
        setImportanceData(data);
      } catch (error) {
        console.error('중요도 데이터 불러오기 실패:', error);
      }
    };

    loadImportanceData();
  }, []);

  return (
    <div className="mt-30 mb-50 bg-slate-100">
      <div className="mb-6 flex items-center">
        <span className="rounded-full bg-blue-500 px-4 py-1.5 text-xl text-white shadow-md">
          중요도별 분석
        </span>
      </div>

      <div className="rounded-2xl bg-white shadow-sm divide-y py-3 px-10 divide-slate-300">
        <ImportanceGroup title="중요도 상" items={importanceData.high} />
        <ImportanceGroup title="중요도 중" items={importanceData.normal} />
        <ImportanceGroup title="중요도 하" items={importanceData.low} />
      </div>
    </div>
  );
}
