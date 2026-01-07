import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { TbMainQuizRepository } from './repositories/tb-main-quiz.respository';

import { TbMainQuiz } from './entities/tb-main-quiz.entity';
import { TbChecklistItem } from './entities/tb-checklist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TbMainQuiz, TbChecklistItem])],
  controllers: [QuizzesController],
  providers: [QuizzesService, TbMainQuizRepository],
  exports: [QuizzesService],
})
export class QuizModule {}
