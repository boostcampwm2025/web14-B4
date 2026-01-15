import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import {
  MainQuiz,
  DifficultyLevel,
} from '../../datasources/entities/tb-main-quiz.entity';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  @Get()
  async getAllQuizzes(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: DifficultyLevel,
  ) {
    const result: MainQuiz[] = await this.quizService.getQuizzes(
      category,
      difficulty,
    );
    return result;
  }

  @Get('categories')
  getCategories(@Query('difficulty') difficulty?: DifficultyLevel) {
    const result = this.quizService.getCategoriesWithCount(difficulty);
    return result;
  }

  @Get(':mainQuizId/checklist')
  async getQuizChecklist(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
  ) {
    const result = await this.quizService.getQuizChecklist(mainQuizId);
    return result;
  }

  @Get(':id')
  async getQuiz(@Param('id', ParseIntPipe) id: number) {
    const result = await this.quizService.findOne(id);

    if (!result) {
      throw new NotFoundException('퀴즈를 찾을 수 없습니다.');
    }

    return result;
  }
}
