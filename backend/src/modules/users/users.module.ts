import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatasourcesModule } from 'src/datasources/datasources.module';
import { QuizModule } from 'src/modules/quizzes/quizzes.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [DatasourcesModule, QuizModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
