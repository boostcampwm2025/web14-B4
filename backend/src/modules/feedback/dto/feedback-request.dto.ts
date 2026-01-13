import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAIFeedbackRequestDto {
  @IsNumber()
  @Type(() => Number)
  mainQuizId: number;

  @IsNumber()
  @Type(() => Number)
  solvedQuizId: number;
}
