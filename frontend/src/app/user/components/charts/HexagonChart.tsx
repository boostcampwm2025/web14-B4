'use client';

import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ComprehensionData } from '../../types/table';

interface ChartDataItem {
  subject: string;
  value: number;
  fullMark: number;
}

export default function HexagonChart() {
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

  const convertToRadarData = (comprehensionData: ComprehensionData[]) => {
    return comprehensionData.map((item) => ({
      subject: item.category,
      value: item.comprehensionScore,
      fullMark: 5,
    }));
  };

  const data = convertToRadarData(comprehensionData);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} />
        <Radar
          name="분야별 이해도 평균"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
