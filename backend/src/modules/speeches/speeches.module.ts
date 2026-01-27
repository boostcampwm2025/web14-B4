import { Module } from '@nestjs/common';
import { SpeechesService } from './speeches.service';
import { SpeechesController } from './speeches.controller';
import { DatasourcesModule } from 'src/datasources/datasources.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [DatasourcesModule, AuthModule],
  controllers: [SpeechesController],
  providers: [SpeechesService],
})
export class SpeechesModule {}
