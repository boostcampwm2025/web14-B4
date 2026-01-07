import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  @Get(':mainQuizeId/checklist')
  async getQuizChecklist(
    @Param('mainQuizeId', ParseIntPipe) mainQuizeId: number,
  ) {
    return this.quizService.getQuizChecklist(mainQuizeId);
  }
}
