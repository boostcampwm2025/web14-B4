export interface ImportanceItem {
  solvedQuizId: number;
  category: string;
  mainQuizId: number;
  mainQuizTitle: string;
  createdAt: string;
}

export interface ImportanceData {
  high: ImportanceItem[];
  normal: ImportanceItem[];
  low: ImportanceItem[];
}
