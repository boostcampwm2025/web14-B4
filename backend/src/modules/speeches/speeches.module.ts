import { Module } from '@nestjs/common';
import { SpeechesService } from './speeches.service';
import { SpeechesController } from './speeches.controller';

@Module({
  controllers: [SpeechesController],
  providers: [SpeechesService],
})
export class SpeechesModule {}
