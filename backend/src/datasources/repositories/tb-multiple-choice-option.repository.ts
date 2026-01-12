import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoiceOption } from '../entities/tb-multiple-choice-option.entity';

@Injectable()
export class MultipleChoiceOptionRepository {
  constructor(
    @InjectRepository(MultipleChoiceOption)
    private readonly repository: Repository<MultipleChoiceOption>,
  ) {}

  findByMultipleChoiceId(
    multipleChoiceId: number,
  ): Promise<MultipleChoiceOption[]> {
    return this.repository.find({
      where: {
        multipleChoiceId: { multipleChoiceId },
      },
    });
  }
}
