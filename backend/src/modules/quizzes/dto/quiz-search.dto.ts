import { IsOptional, IsEnum, IsString } from 'class-validator';
import { CursorPaginationDto } from 'src/common/dto/pagination-response.dto';
import { DifficultyLevel } from 'src/datasources/entities/tb-main-quiz.entity';

export class QuizInfiniteScrollDto extends CursorPaginationDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;
}

export class QuizFilterDto {
  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;
}
