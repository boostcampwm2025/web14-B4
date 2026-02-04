'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SolvedData } from '../../types/table';

interface DonutChartProps {
  solvedData: SolvedData[];
}

export default function DonutChart({ solvedData }: DonutChartProps) {
  const COLORS = [
    '#a8dadc', // 파스텔 청록
    '#f1faee', // 아이보리
    '#e63946', // 빨강
    '#457b9d', // 파란색
    '#1d3557', // 진한 파랑
    '#fca311', // 노란색
    '#14213d', // 네이비
    '#ffafcc', // 연분홍
    '#bde0fe', // 하늘색
    '#a2d2ff', // 연파랑
    '#cdb4db', // 연보라
    '#ffc8dd', // 분홍
    '#caffbf', // 연두
    '#9bf6ff', // 민트
    '#fdffb6', // 연노랑
    '#bdb2ff', // 라벤더
    '#ffd6a5', // 복숭아색
    '#ffadad', // 연한 빨강
    '#a0c4ff', // 베이비블루
    '#ffd6ff', // 연한 자주
  ];

  const data = solvedData.map((cat) => ({
    name: cat.category,
    value: cat.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          wrapperStyle={{
            paddingLeft: '30px',
            fontSize: '13px',
            lineHeight: '24px',
          }}
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
