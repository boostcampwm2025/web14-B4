export class UpdateSpeechTextResponseDto {
  mainQuizId: number;
  solvedQuizId: number;
  speechText: string;

  constructor(mainQuizId: number, solvedQuizId: number, speechText: string) {
    this.mainQuizId = mainQuizId;
    this.solvedQuizId = solvedQuizId;
    this.speechText = speechText;
  }
}
