import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class UpdateSpeechTextRequestDto {
  @IsNumber()
  @IsNotEmpty()
  solvedQuizId: number;

  @IsString()
  @IsNotEmpty()
  speechText: string;
}
