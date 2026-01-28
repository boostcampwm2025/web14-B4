import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { DatasourcesModule } from 'src/datasources/datasources.module';
import { SpeechesService } from '../speeches/speeches.service';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatasourcesModule, AuthModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, SpeechesService, UsersService],
})
export class FeedbackModule {}
