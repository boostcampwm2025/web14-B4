'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function DonutChart() {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const categories = [
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

  const data = categories.map((cat) => ({
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
