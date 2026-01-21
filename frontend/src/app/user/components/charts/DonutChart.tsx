'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SolvedData } from '../../types/table';

interface DonutChartProps {
  solvedData: SolvedData[];
}

export default function DonutChart({ solvedData }: DonutChartProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const data = solvedData.map((cat) => ({
    name: cat.category,
    value: cat.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
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
