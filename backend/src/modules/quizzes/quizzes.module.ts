import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.respository';

import { MainQuiz } from '../../datasources/entities/tb-main-quiz.entity';
import { ChecklistItem } from '../../datasources/entities/tb-checklist-item.entity';
import { QuizCategory } from 'src/datasources/entities/tb-quiz-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizCategory, MainQuiz, ChecklistItem])],
  controllers: [QuizzesController],
  providers: [QuizzesService, MainQuizRepository],
  exports: [QuizzesService],
})
export class QuizModule {}
