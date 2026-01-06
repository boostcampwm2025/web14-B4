import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { MainQuizEntity } from './entities/main-quiz.entity';

@Controller('quizzes')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Get()
    async getAllQuizzes(): Promise<MainQuizEntity[]> {
        return await this.quizService.findAll();
    }
}