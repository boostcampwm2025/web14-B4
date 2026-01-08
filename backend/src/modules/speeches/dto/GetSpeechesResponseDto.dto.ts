import { SpeechItemDto } from './SpeechItemDto.dto';

export class GetSpeechesResponseDto {
  quizId: number;
  speeches: SpeechItemDto[];

  constructor(quizId: number, speeches: SpeechItemDto[]) {
    this.quizId = quizId;
    this.speeches = speeches;
  }
}
