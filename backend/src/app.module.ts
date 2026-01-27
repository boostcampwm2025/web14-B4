import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './modules/quizzes/quizzes.module';
import { SpeechesModule } from './modules/speeches/speeches.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { UsersModule } from './modules/users/users.module';
import { WinstonModule } from 'nest-winston';
import { buildWinstonConfig } from './common/config/winston.config';
import { getLoggerSettings } from './common/config/logger.config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 사용
    }),
    WinstonModule.forRoot(buildWinstonConfig(getLoggerSettings())),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'), // .env 파일에서 읽어옴
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/datasources/entities/*.entity{.ts,.js}'],
        synchronize: false,
        dropSchema: false,
        extra: {
          // bigint를 string이 아닌 number로 파싱
          parseInt8: true,
        },
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        const dataSource = new DataSource(options);
        await dataSource.initialize();

        // DataSource를 트랜잭션 지원 DataSource로 래핑
        return addTransactionalDataSource(dataSource);
      },
      inject: [ConfigService],
    }),
    UsersModule,
    SpeechesModule,
    QuizModule,
    FeedbackModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
