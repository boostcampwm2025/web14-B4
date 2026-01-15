import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsInt,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Importance,
  ComprehensionLevel,
} from '../../../datasources/entities/tb-solved-quiz.entity';

export class SaveSolvedQuizRequestDto {
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

export class SaveImportanceRequestDto {
  @IsInt()
  @Type(() => Number)
  mainQuizId: number;

  @IsInt()
  @Type(() => Number)
  solvedQuizId: number;

  @IsEnum(Importance, { message: '중요도 값이 올바르지 않습니다.' })
  importance: Importance;
}
