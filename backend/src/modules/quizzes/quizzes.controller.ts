import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  @Get(':mainQuizId/checklist')
  async getQuizChecklist(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
  ) {
    const result = await this.quizService.getQuizChecklist(mainQuizId);
    return {
      success: true,
      message: '성공했습니다.',
      errorCode: null,
      data: result,
    };
  }
}
