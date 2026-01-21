import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { MultipleChoiceQuizSeeder } from './multiple-choice-quiz.seeder';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap(): Promise<void> {
  initializeTransactionalContext();

  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(MultipleChoiceQuizSeeder);
  await seeder.seed();

  console.warn('✅ Seeding completed!');

  await app.close();
}

void bootstrap().catch((error: Error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
