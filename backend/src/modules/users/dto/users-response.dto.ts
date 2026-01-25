import { ComprehensionStatistics } from './../types/statistics.types';
import { Importance } from '../../../datasources/entities/tb-solved-quiz.entity';

export class SolvedQuizResponseDto {
  mainQuizId: number;
  solvedQuizId: number;
}

export class SaveImportanceResponseDto {
  solvedQuizId: number;
  importance: Importance;

  constructor(params: { solvedQuizId: number; importance: Importance }) {
    this.solvedQuizId = params.solvedQuizId;
    this.importance = params.importance;
  }
}

export class GetUserComprehensionsResponseDto {
  comprehensionData: ComprehensionStatistics[];
  constructor(comprehensionData: ComprehensionStatistics[]) {
    this.comprehensionData = comprehensionData;
  }
}
