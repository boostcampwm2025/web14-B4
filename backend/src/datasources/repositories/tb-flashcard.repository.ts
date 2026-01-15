import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flashcard } from '../entities/tb-flashcard.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlashcardRepository {
  constructor(
    @InjectRepository(Flashcard)
    private readonly repository: Repository<Flashcard>,
  ) {}

  findByMainQuizId(mainQuizId: number): Promise<Flashcard[]> {
    return this.repository.find({
      where: {
        mainQuiz: { mainQuizId },
      },
    });
  }
}
