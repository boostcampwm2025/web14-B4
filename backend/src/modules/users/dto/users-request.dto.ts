import {
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

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
