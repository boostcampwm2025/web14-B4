import { Module } from '@nestjs/common';
import { DatasourcesModule } from 'src/datasources/datasources.module';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

// Entities are provided via DatasourcesModule

@Module({
  imports: [DatasourcesModule],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizModule {}
