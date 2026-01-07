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

  @IsArray()
  @ArrayMinSize(1, { message: 'checklistItems는 최소 1개 이상이어야 합니다.' })
  @ValidateNested({ each: true })
  @Type(() => ChecklistPregressItemDto)
  checklistItems: ChecklistPregressItemDto[];
}

export class ChecklistPregressItemDto {
  @IsNumber()
  @Type(() => Number)
  checklistItemId: number;

  @IsBoolean()
  isChecked: boolean;
}
