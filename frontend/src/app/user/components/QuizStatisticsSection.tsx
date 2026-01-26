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

export default function QuizStatisticsSection({
  comprehensionData,
  solvedData,
}: QuizStatisticsSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('understanding');

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex justify-center mb-6">
        <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 분야별 이해도 탭 */}
      {activeTab === 'understanding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <HexagonChart comprehensionData={comprehensionData} />
          <BasicTable type="comprehension" data={comprehensionData} />
        </div>
      )}

      {/* 지금까지 푼 문제 탭 */}
      {activeTab === 'solved' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <DonutChart solvedData={solvedData} />
          <BasicTable type="solved" data={solvedData} />
        </div>
      )}
    </div>
  );
}
