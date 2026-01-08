import { Controller, Get, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  MainQuizEntity,
  DifficultyLevel,
} from '../../datasources/entities/main-quiz.entity';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getAllQuizzes(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: DifficultyLevel,
  ) {
    const result: MainQuizEntity[] = await this.quizService.findAll(
      category,
      difficulty,
    );
    return result;
  }

  @Get('categories')
  getCategories() {
    const result = this.quizService.getCategoriesWithCount();
    return result;
  }
}
