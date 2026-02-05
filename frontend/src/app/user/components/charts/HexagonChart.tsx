'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ComprehensionData } from '../../types/table';

interface HexagonChartProps {
  comprehensionData: ComprehensionData[]; // 배열을 객체의 속성으로
}

export default function HexagonChart({ comprehensionData }: HexagonChartProps) {
  const convertToRadarData = (comprehensionData: ComprehensionData[]) => {
    return comprehensionData.map((item) => ({
      subject: item.category,
      value: item.comprehensionScore,
      fullMark: 5,
    }));
  };

  const data = convertToRadarData(comprehensionData);

  return (
    <ResponsiveContainer width="100%" height={300}>
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
