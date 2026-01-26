'use client';

import { useState } from 'react';
import { ComprehensionData, SolvedData } from '../types/table';
import TabSwitch, { Tab } from './TabSwitch';
import HexagonChart from './charts/HexagonChart';
import { BasicTable } from './tables/BasicTable';
import DonutChart from './charts/DonutChart';

interface QuizStatisticsSectionProps {
  comprehensionData: ComprehensionData[];
  solvedData: SolvedData[];
}

// 빈 상태 컴포넌트를 외부로 분리
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-gray-400 mb-4">
      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </div>
    <p className="text-gray-600 text-lg font-medium">아직 통계 데이터가 존재하지 않아요</p>
    <p className="text-gray-400 text-sm mt-2">문제를 풀면 통계가 표시됩니다</p>
  </div>
);

export default function QuizStatisticsSection({
  comprehensionData,
  solvedData,
}: QuizStatisticsSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('understanding');

  // 빈 배열 체크
  const hasComprehensionData = comprehensionData.length > 0;
  const hasSolvedData = solvedData.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-center mb-6">
        <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 분야별 이해도 탭 */}
      {activeTab === 'understanding' && (
        <>
          {hasComprehensionData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <HexagonChart comprehensionData={comprehensionData} />
              <BasicTable type="comprehension" data={comprehensionData} />
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {/* 지금까지 푼 문제 탭 */}
      {activeTab === 'solved' && (
        <>
          {hasSolvedData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <DonutChart solvedData={solvedData} />
              <BasicTable type="solved" data={solvedData} />
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </div>
  );
}
