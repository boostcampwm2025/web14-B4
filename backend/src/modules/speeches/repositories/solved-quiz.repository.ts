import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SolvedQuiz } from '../entities/tb-solved-quiz.entity';

@Injectable()
export class SolvedQuizRepository extends Repository<SolvedQuiz> {
  constructor(private dataSource: DataSource) {
    super(SolvedQuiz, dataSource.createEntityManager());
  }

  async createSolvedQuiz(
    userId: number,
    mainQuizId: number,
    speechText: string,
  ): Promise<SolvedQuiz> {
    const solvedQuiz = this.create({
      userId,
      mainQuizId,
      speechText,
    });

    return await this.save(solvedQuiz);
  }

  // 최신 순으로 조회
  async findByQuizAndUser(
    mainQuizId: number,
    userId: number,
  ): Promise<SolvedQuiz[]> {
    return await this.find({
      where: { mainQuizId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateSpeechText(
    solvedQuizId: number,
    speechText: string,
  ): Promise<SolvedQuiz> {
    const solvedQuiz = await this.findById(solvedQuizId);

    // TODO : 별도 ERROR class 생성하여 부여 필요
    if (!solvedQuiz) throw new Error('SolvedQuizId가 존재하지 않습니다.');

    solvedQuiz.speechText = speechText;

    return await this.save(solvedQuiz);
  }

  async findById(solvedQuizId: number): Promise<SolvedQuiz | null> {
    return await this.findOne({ where: { solvedQuizId } });
  }
}
