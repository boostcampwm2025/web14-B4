import {
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Importance } from '../../../datasources/entities/tb-solved-quiz.entity';

export class SaveChecklistProgressDto {
  @IsNumber()
  @Type(() => Number)
  mainQuizId: number;

  @IsNumber()
  @Type(() => Number)
  solvedQuizId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'checklistItems는 최소 1개 이상이어야 합니다.' })
  @ValidateNested({ each: true })
  @Type(() => ChecklistProgressItemDto)
  checklistItems: ChecklistProgressItemDto[];
}

export class ChecklistProgressItemDto {
  @IsNumber()
  @Type(() => Number)
  checklistItemId: number;

  @IsBoolean()
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
