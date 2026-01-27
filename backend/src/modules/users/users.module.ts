import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatasourcesModule } from 'src/datasources/datasources.module';
import { QuizModule } from '../quizzes/quizzes.module';

@Module({
  imports: [DatasourcesModule, QuizModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
