import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { SolvedQuiz } from '../entities/tb-solved-quiz.entity';
import { UpdateResult } from 'typeorm/browser';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SolvedQuizRepository {
  constructor(
    @InjectRepository(SolvedQuiz)
    private readonly repository: Repository<SolvedQuiz>,
  ) {}

  async createSolvedQuiz(
    solvedQuiz: DeepPartial<SolvedQuiz>,
  ): Promise<SolvedQuiz> {
    return await this.repository.save(solvedQuiz);
  }

  // 최신 순으로 조회
  async getByQuizAndUser(
    mainQuizId: number,
    userId: number,
  ): Promise<SolvedQuiz[]> {
    return await this.repository.find({
      where: {
        mainQuiz: { mainQuizId },
        user: { userId },
      },
      relations: ['mainQuiz', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateSpeechText(
    id: number,
    speechText: string,
  ): Promise<UpdateResult> {
    return await this.repository.update(id, { speechText });
  }

  async getById(solvedQuizId: number): Promise<SolvedQuiz | null> {
    return await this.repository.findOne({
      where: { solvedQuizId },
      relations: ['mainQuiz', 'user'],
    });
  }
}
