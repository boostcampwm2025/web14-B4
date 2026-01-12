import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MainQuizRepository } from 'src/datasources/repositories/tb-main-quiz.repository';
import { UserChecklistProgress } from 'src/datasources/entities/tb-user-checklist-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainQuiz } from 'src/datasources/entities/tb-main-quiz.entity';
import { UserChecklistProgressRepository } from 'src/datasources/repositories/tb-user-checklist-progress.repository';
import { QuizCategory } from 'src/datasources/entities/tb-quiz-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizCategory, MainQuiz, UserChecklistProgress]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    MainQuizRepository,
    UserChecklistProgressRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
