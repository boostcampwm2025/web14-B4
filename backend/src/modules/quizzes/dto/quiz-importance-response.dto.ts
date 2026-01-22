export class QuizImportanceItemDto {
  solvedQuizId: number;
  category: string;
  mainQuizId: number;
  mainQuizTitle: string;
  createdAt: string;
}

export class QuizImportanceDataDto {
  high: QuizImportanceItemDto[];
  normal: QuizImportanceItemDto[];
  low: QuizImportanceItemDto[];
}
