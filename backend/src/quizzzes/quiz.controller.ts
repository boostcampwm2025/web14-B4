import { Controller, Get, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { MainQuizEntity } from './entities/main-quiz.entity';

@Controller('quizzes')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Get()
    async getAllQuizzes(
        @Query('category') category?: string,
        @Query('difficulty') difficulty?: string,
    ): Promise<MainQuizEntity[]> {
        return await this.quizService.findAll(category, difficulty);
    }
}