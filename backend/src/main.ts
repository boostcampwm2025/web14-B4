import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { WinstonModule } from 'nest-winston';
import { buildWinstonConfig } from './common/config/winston.config';
import { getLoggerSettings } from './common/config/logger.config';

async function bootstrap() {
  initializeTransactionalContext();
  const loggerSettings = getLoggerSettings();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(buildWinstonConfig(loggerSettings)),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: ['http://localhost:3000', true],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
