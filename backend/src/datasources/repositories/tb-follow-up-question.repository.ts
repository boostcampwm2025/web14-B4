import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowUpQuestion } from '../entities/tb-follow-up-question.entity';

@Injectable()
export class FollowUpQuestionRepository {
  constructor(
    @InjectRepository(FollowUpQuestion)
    private readonly repository: Repository<FollowUpQuestion>,
  ) {}

  findByMainQuizId(mainQuizId: number): Promise<FollowUpQuestion[]> {
    return this.repository.find({
      where: {
        mainQuizId: { mainQuizId },
      },
    });
  }
}
