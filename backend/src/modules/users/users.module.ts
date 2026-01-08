import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TbMainQuizRepository } from 'src/datasources/repositories/tb-main-quiz.respository';
import { TbUserChecklistProgress } from 'src/datasources/entities/tb-user-checklist-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TbMainQuiz } from 'src/datasources/entities/tb-main-quiz.entity';
import { TbUserChecklistProgressRepository } from 'src/datasources/repositories/tb-user-checklist-progress.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TbMainQuiz, TbUserChecklistProgress])],
  controllers: [UsersController],
  providers: [
    UsersService,
    TbMainQuizRepository,
    TbUserChecklistProgressRepository,
  ],
  exports: [UsersService],
})
export class UsersModule {}
