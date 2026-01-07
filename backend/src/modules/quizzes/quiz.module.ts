import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
