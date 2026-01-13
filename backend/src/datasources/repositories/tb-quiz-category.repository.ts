import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizCategory } from '../entities/tb-quiz-category.entity';

@Injectable()
export class QuizCategoryRepository {
  constructor(
    @InjectRepository(QuizCategory)
    private readonly repository: Repository<QuizCategory>,
  ) {}

  findById(id: number): Promise<QuizCategory | null> {
    return this.repository.findOne({
      where: { quizCategoryId: id },
    });
  }

  findAll(): Promise<QuizCategory[]> {
    return this.repository.find();
  }
}
