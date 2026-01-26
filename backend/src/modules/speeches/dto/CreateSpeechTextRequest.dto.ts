import { IsString } from 'class-validator';

export class CreateSpeechTextRequestDto {
  @IsString()
  speechText: string;
}
