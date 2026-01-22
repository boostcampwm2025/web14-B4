import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { SolvedQuiz, Importance } from '../entities/tb-solved-quiz.entity';
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

  async updateSolvedQuiz(solvedQuiz: SolvedQuiz): Promise<SolvedQuiz> {
    await this.repository.update(
      { solvedQuizId: solvedQuiz.solvedQuizId },
      {
        speechText: solvedQuiz.speechText,
        comprehensionLevel: solvedQuiz.comprehensionLevel,
      },
    );
    return solvedQuiz;
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

  async updateSpeechText(id: number, speechText: string): Promise<boolean> {
    const updateResult = await this.repository.update(id, { speechText });

    if (!updateResult || updateResult.affected === 0) {
      return false;
    }
    return true;
  }

  async getById(solvedQuizId: number): Promise<SolvedQuiz | null> {
    return await this.repository.findOne({
      where: { solvedQuizId },
      relations: ['mainQuiz', 'user'],
    });
  }

  async getSpeechTextById(solvedQuizId: number): Promise<string | null> {
    const result = await this.repository.findOne({
      where: { solvedQuizId },
      select: ['speechText'],
    });

    return result?.speechText ?? null;
  }

  /* update 성공 시, true. 실패시 false 반환 */
  async updateAiFeedback(
    solvedQuizId: number,
    aiFeedback: Record<string, unknown>,
  ): Promise<boolean> {
    const result = await this.repository.update(
      { solvedQuizId },
      { aiFeedback },
    );

    if (!result.affected || result.affected <= 0) return false;
    return true;
  }

  async updateImportance(
    solvedQuizId: number,
    importance: Importance,
  ): Promise<UpdateResult> {
    return await this.repository.update(solvedQuizId, { importance });
  }

  async getImportanceByUserId(userId: number): Promise<SolvedQuiz[]> {
    return this.repository
      .createQueryBuilder('sq')
      .innerJoinAndSelect('sq.mainQuiz', 'mq')
      .innerJoinAndSelect('mq.quizCategory', 'qc')
      .where('sq.user_id = :userId', { userId })
      .andWhere('sq.importance IS NOT NULL')
      .distinctOn(['sq.main_quiz_id'])
      .orderBy('sq.main_quiz_id')
      .addOrderBy('sq.created_at', 'DESC')
      .getMany();
  }
}
