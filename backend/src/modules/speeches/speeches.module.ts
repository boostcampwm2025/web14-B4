import { Module } from '@nestjs/common';
import { SpeechesService } from './speeches.service';
import { SpeechesController } from './speeches.controller';
import { DatasourcesModule } from 'src/datasources/datasources.module';

@Module({
  imports: [DatasourcesModule],
  controllers: [SpeechesController],
  providers: [SpeechesService],
})
export class SpeechesModule {}
