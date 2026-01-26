import { IsString } from 'class-validator';

export class CreateSpeechTextAnswerRequestDto {
  @IsString()
  speechText: string;
}
