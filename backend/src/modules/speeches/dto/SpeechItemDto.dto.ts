export class SpeechItemDto {
  solvedQuizId: number;
  speechText: string;
  createdAt: Date;

  constructor(solvedQuizId: number, speechText: string, createdAt: Date) {
    this.solvedQuizId = solvedQuizId;
    this.speechText = speechText;
    this.createdAt = createdAt;
  }
}
