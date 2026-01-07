import { Controller, Get, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { MainQuizEntity } from '../../../src/datasources/entities/main-quiz.entity';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getAllQuizzes(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const result: MainQuizEntity[] = await this.quizService.findAll(
      category,
      difficulty,
    );
    return {
      success: true,
      message: '퀴즈 목록 조회를 성공했습니다.',
      errorCode: null,
      data: result,
    };
  }

  @Get('categories')
  async getCategories() {
    const result = await this.quizService.getCategoriesWithCount();
    return {
      success: true,
      message: '카테고리 조회를 성공했습니다.',
      errorCode: null,
      data: result,
    };
  }
}
