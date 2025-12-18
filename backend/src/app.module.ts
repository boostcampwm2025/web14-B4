import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordsModule } from './modules/records/records.module';

@Module({
  imports: [RecordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
