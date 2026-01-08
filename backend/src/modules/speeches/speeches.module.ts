import { Module } from '@nestjs/common';
import { SpeechesService } from './speeches.service';
import { SpeechesController } from './speeches.controller';
import { SolvedQuizRepository } from '../../datasources/repositories/solved-quiz.repository';

@Module({
  controllers: [SpeechesController],
  providers: [SpeechesService, SolvedQuizRepository],
})
export class SpeechesModule {}
