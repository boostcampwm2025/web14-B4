import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { SolvedQuiz } from '../entities/tb-solved-quiz.entity';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class SolvedQuizRepository extends Repository<SolvedQuiz> {
  constructor(private dataSource: DataSource) {
    super(SolvedQuiz, dataSource.createEntityManager());
  }

  async createSolvedQuiz(
    solvedQuiz: DeepPartial<SolvedQuiz>,
  ): Promise<SolvedQuiz> {
    return await this.save(solvedQuiz);
  }

  // 최신 순으로 조회
  async getByQuizAndUser(
    mainQuizId: number,
    userId: number,
  ): Promise<SolvedQuiz[]> {
    return await this.find({
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
    return await this.update(id, { speechText });
  }

  async getById(solvedQuizId: number): Promise<SolvedQuiz | null> {
    return await this.findOne({
      where: { solvedQuizId },
      relations: ['mainQuiz', 'user'],
    });
  }
}
