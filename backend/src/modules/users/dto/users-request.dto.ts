import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComprehensionLevel } from 'src/datasources/entities/tb-solved-quiz.entity';

export default class SaveSolvedQuizRequestDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  mainQuizId: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  solvedQuizId: number;

  @IsString()
  @IsNotEmpty()
  speechText: string;

  @IsEnum(ComprehensionLevel)
  comprehensionLevel: ComprehensionLevel;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistProgressItemDto)
  checklistItems: ChecklistProgressItemDto[];
}

export class ChecklistProgressItemDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  checklistItemId: number;

  @IsBoolean()
  @IsNotEmpty()
  isChecked: boolean;
}
