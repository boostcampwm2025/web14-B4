'use client';

import { useState } from 'react';
import DonutChart from './components/charts/DonutChart';
import HexagonChart from './components/charts/HexagonChart';
import { ComprehensionTable } from './components/DynamicTabl2';
import { DynamicTable } from './components/DynamicTable';
import MyProfile, { mockUserData } from './components/MyProfile';
import TabSwitch, { Tab } from './components/TabSwitch';
import { BasicTable } from './components/tables/BasicTable';

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('understanding');

  const comprehensionData = [
    {
      category: '네트워크',
      totalSolved: 12,
      high: 10,
      medium: 2,
      low: 0,
      comprehensionScore: 4.83, // 매우 우수
    },
    {
      category: '자료구조',
      totalSolved: 20,
      high: 12,
      medium: 6,
      low: 2,
      comprehensionScore: 4.2, // 우수
    },
    {
      category: '알고리즘',
      totalSolved: 15,
      high: 8,
      medium: 5,
      low: 2,
      comprehensionScore: 3.73, // 우수
    },
    {
      category: '데이터베이스',
      totalSolved: 18,
      high: 5,
      medium: 9,
      low: 4,
      comprehensionScore: 3.22, // 보통
    },
    {
      category: '운영체제',
      totalSolved: 8,
      high: 2,
      medium: 4,
      low: 2,
      comprehensionScore: 3.0, // 보통
    },
    {
      category: '소프트웨어공학',
      totalSolved: 10,
      high: 3,
      medium: 3,
      low: 4,
      comprehensionScore: 2.6, // 보통 (하한선)
    },
    {
      category: '컴퓨터구조',
      totalSolved: 6,
      high: 1,
      medium: 2,
      low: 3,
      comprehensionScore: 2.0, // 미흡
    },
    {
      category: '프로그래밍 언어',
      totalSolved: 14,
      high: 2,
      medium: 5,
      low: 7,
      comprehensionScore: 2.14, // 미흡
    },
  ];

  const solvedData = [
    {
      category: '자료구조',
      solvedQuizAmount: 42,
      totalQuizAmount: 50,
      percentage: 84,
    },
    {
      category: '알고리즘',
      solvedQuizAmount: 35,
      totalQuizAmount: 78,
      percentage: 45,
    },
    {
      category: '운영체제',
      solvedQuizAmount: 38,
      totalQuizAmount: 50,
      percentage: 76,
    },
    {
      category: '네트워크',
      solvedQuizAmount: 45,
      totalQuizAmount: 50,
      percentage: 90,
    },
    {
      category: '데이터베이스',
      solvedQuizAmount: 38,
      totalQuizAmount: 50,
      percentage: 76,
    },
    {
      category: '소프트웨어공학',
      solvedQuizAmount: 32,
      totalQuizAmount: 50,
      percentage: 64,
    },
    {
      category: '컴퓨터구조',
      solvedQuizAmount: 50,
      totalQuizAmount: 50,
      percentage: 100,
    },
  ];

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <div className="space-y-3">
        <MyProfile user={mockUserData} />
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-center mb-6">
            <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* 분야별 이해도 탭 */}
          {activeTab === 'understanding' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <HexagonChart />
              </div>
              <div>
                <BasicTable type="comprehension" data={comprehensionData} />
              </div>
            </div>
          )}

          {/* 지금까지 푼 문제 탭 */}
          {activeTab === 'solved' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <DonutChart />
              </div>
              <div>
                <BasicTable type="solved" data={solvedData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
