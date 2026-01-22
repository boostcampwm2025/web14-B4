export type TableType = 'comprehension' | 'solved';

export interface ComprehensionData {
  category: string;
  totalSolved: number;
  high: number;
  medium: number;
  low: number;
  comprehensionScore: number;
}

export interface SolvedData {
  category: string;
  solvedQuizAmount: number;
  totalQuizAmount: number;
  percentage: number;
}

export interface BasicTableProps {
  type: TableType;
  data: ComprehensionData[] | SolvedData[];
}
