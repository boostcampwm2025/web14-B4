export class CreateSpeechTextResponseDto {
  mainQuizId: number;
  solvedQuizId: number;

  constructor(params: { mainQuizId: number; solvedQuizId: number }) {
    this.mainQuizId = params.mainQuizId;
    this.solvedQuizId = params.solvedQuizId;
  }
}
