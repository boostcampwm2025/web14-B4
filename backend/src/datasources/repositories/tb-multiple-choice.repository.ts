import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoice } from '../entities/tb-multiple-choice.entity';

@Injectable()
export class MultipleChoiceRepository {
  constructor(
    @InjectRepository(MultipleChoice)
    private readonly repository: Repository<MultipleChoice>,
  ) {}

  findByMainQuizId(mainQuizId: number): Promise<MultipleChoice[]> {
    return this.repository.find({
      where: {
        mainQuizId: { mainQuizId },
      },
      relations: ['options'],
    });
  }
}
