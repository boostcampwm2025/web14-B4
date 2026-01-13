import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizKeyword } from '../entities/tb-quiz-keyword.entity';

@Injectable()
export class QuizKeywordRepository {
  constructor(
    @InjectRepository(QuizKeyword)
    private readonly repository: Repository<QuizKeyword>,
  ) {}

  findByMainQuizId(mainQuizId: number): Promise<QuizKeyword[]> {
    return this.repository.find({
      where: {
        mainQuiz: { mainQuizId },
      },
    });
  }
}
