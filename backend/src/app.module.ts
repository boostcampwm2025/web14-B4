import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordsModule } from './modules/records/records.module';
import { QuizModule } from './modules/quizzes/quizzes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 사용
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'), // .env 파일에서 읽어옴
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        extra: {
          // bigint를 string이 아닌 number로 파싱
          parseInt8: true,
        },
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        // ✅ DataSource 생성 및 초기화
        const dataSource = new DataSource(options);
        await dataSource.initialize(); // ✅ await 추가

        // DataSource를 트랜잭션 지원 DataSource로 래핑
        return addTransactionalDataSource(dataSource);
      },
      inject: [ConfigService],
    }),
    RecordsModule,
    QuizModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
