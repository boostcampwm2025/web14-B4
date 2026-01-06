export class SttResponseDto {
  solvedQuizId: number;
  text: string;

  constructor(solvedQuizId: number, text: string) {
    this.solvedQuizId = solvedQuizId;
    this.text = text;
  }
}
