import { Importance } from '../../../datasources/entities/tb-solved-quiz.entity';

export class SaveChecklistProgressResponseDto {
  savedCount: number;
}

export class SaveImportanceResponseDto {
  solvedQuizId: number;
  importance: Importance;

  constructor(params: { solvedQuizId: number; importance: Importance }) {
    this.solvedQuizId = params.solvedQuizId;
    this.importance = params.importance;
  }
}
