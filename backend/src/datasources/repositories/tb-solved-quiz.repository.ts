import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial, Repository, DataSource } from 'typeorm';
import {
  SolvedQuiz,
  Importance,
  SolvedState,
} from '../entities/tb-solved-quiz.entity';
import { UpdateResult } from 'typeorm/browser';
import { InjectRepository } from '@nestjs/typeorm';
import { z } from 'zod';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { BusinessException } from 'src/common/exceptions/business.exception';

// 스키마 정의
const ComprehensionStatisticsSchema = z
  .object({
    category: z.string(),
    totalSolved: z.number().int().nonnegative(),
    high: z.number().int().nonnegative(),
    normal: z.number().int().nonnegative(),
    low: z.number().int().nonnegative(),
    comprehensionScore: z.number().min(0).max(5),
  })
  .strict();

const SolvedStatisticsSchema = z
  .object({
    category: z.string(),
    solvedQuizAmount: z.number().int().nonnegative(),
    totalQuizAmount: z.number().int().nonnegative(),
    percentage: z.number().min(0).max(100),
  })
  .strict();

export type ComprehensionStatistics = z.infer<
  typeof ComprehensionStatisticsSchema
>;
export type SolvedQuizStatistics = z.infer<typeof SolvedStatisticsSchema>;

@Injectable()
export class SolvedQuizRepository {
  constructor(
    @InjectRepository(SolvedQuiz)
    private readonly repository: Repository<SolvedQuiz>,
    private readonly dataSource: DataSource,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
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

  async findByIdAndUserId(
    solvedQuizId: number,
    userId: number,
  ): Promise<SolvedQuiz | null> {
    return await this.repository.findOne({
      where: { solvedQuizId, user: { userId } },
      relations: ['user', 'mainQuiz'],
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

  async updateSolvedState(
    solvedQuizId: number,
    solvedState: SolvedState,
  ): Promise<UpdateResult> {
    return await this.repository.update(solvedQuizId, {
      solvedState,
    });
  }

  async getImportanceByUserId(userId: number): Promise<SolvedQuiz[]> {
    return this.repository
      .createQueryBuilder('sq')
      .innerJoinAndSelect('sq.mainQuiz', 'mq')
      .innerJoinAndSelect('mq.quizCategory', 'qc')
      .where('sq.user_id = :userId', { userId })
      .andWhere('sq.solved_state = :solvedState', {
        solvedState: SolvedState.COMPLETED,
      })
      .andWhere('sq.importance IS NOT NULL')
      .distinctOn(['sq.main_quiz_id'])
      .orderBy('sq.main_quiz_id')
      .addOrderBy('sq.created_at', 'DESC')
      .getMany();
  }

  async getComprehensionStatistics(
    userId: number,
  ): Promise<ComprehensionStatistics[]> {
    const query = `
      WITH latest_solves AS (
        SELECT DISTINCT ON (main_quiz_id)
              main_quiz_id,
              solved_quiz_id,
              comprehension_level
        FROM tb_solved_quiz
        WHERE user_id = $1
          AND solved_state = 'COMPLETED'
          AND comprehension_level IS NOT NULL
        ORDER BY main_quiz_id, created_at DESC
    )
    SELECT 
        COALESCE(tqc.name, '기타') AS category,
        COUNT(ls.solved_quiz_id)::INTEGER AS "totalSolved",
        COUNT(*) FILTER (WHERE ls.comprehension_level = 'HIGH')::INTEGER AS "high",
        COUNT(*) FILTER (WHERE ls.comprehension_level = 'NORMAL')::INTEGER AS "normal",
        COUNT(*) FILTER (WHERE ls.comprehension_level = 'LOW')::INTEGER AS "low",
        ROUND(
            (
              COUNT(*) FILTER (WHERE ls.comprehension_level = 'HIGH')::INTEGER * 5.0 +
              COUNT(*) FILTER (WHERE ls.comprehension_level = 'NORMAL')::INTEGER * 3.0 +
              COUNT(*) FILTER (WHERE ls.comprehension_level = 'LOW')::INTEGER * 1.0
            ) / NULLIF(COUNT(ls.solved_quiz_id)::INTEGER, 0),
            2
        )::FLOAT AS "comprehensionScore"
    FROM tb_main_quiz tmq
    INNER JOIN tb_quiz_category tqc 
        ON tmq.quiz_category_id = tqc.quiz_category_id
    INNER JOIN latest_solves ls 
        ON tmq.main_quiz_id = ls.main_quiz_id
    GROUP BY tqc.name
    ORDER BY "comprehensionScore" DESC NULLS LAST
    `;

    try {
      const rawResults = await this.dataSource.query(query, [userId]);
      return z.array(ComprehensionStatisticsSchema).parse(rawResults);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        this.logger.error(
          `${ERROR_MESSAGES.DATA_VALIDATION_FAILED.message}\nuserId: ${userId}, \nerrors: ${JSON.stringify(error.issues)}`,
        );

        throw new BusinessException(ERROR_MESSAGES.DATA_VALIDATION_FAILED);
      }

      // DB 연결 에러, 쿼리 에러 등 그대로 전파
      throw error;
    }
  }

  async getSolvedQuizStatistics(
    userId: number,
  ): Promise<SolvedQuizStatistics[]> {
    const query = `
      WITH latest_solves AS (
          SELECT DISTINCT ON (main_quiz_id)
                main_quiz_id,
                solved_quiz_id,
                comprehension_level
          FROM tb_solved_quiz
          WHERE user_id = $1
            AND solved_state = 'COMPLETED'
          ORDER BY main_quiz_id, created_at DESC
      )
      SELECT
          tqc.name AS category,
          COUNT(DISTINCT ls.main_quiz_id)::INTEGER AS "solvedQuizAmount",
          COUNT(DISTINCT tmq.main_quiz_id)::INTEGER AS "totalQuizAmount",
          ROUND(
              CASE
                  WHEN COUNT(DISTINCT tmq.main_quiz_id) = 0 THEN 0
                  ELSE (COUNT(DISTINCT ls.main_quiz_id)::DECIMAL / COUNT(DISTINCT tmq.main_quiz_id)) * 100
              END,
              2
          )::FLOAT AS "percentage"
      FROM tb_main_quiz tmq
      JOIN tb_quiz_category tqc
          ON tmq.quiz_category_id = tqc.quiz_category_id
      LEFT JOIN latest_solves ls
          ON tmq.main_quiz_id = ls.main_quiz_id
      GROUP BY tqc.quiz_category_id, tqc.name
      ORDER BY percentage DESC, tqc.name
    `;

    try {
      const rawResults = await this.dataSource.query(query, [userId]);
      return z.array(SolvedStatisticsSchema).parse(rawResults);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        this.logger.error(
          `${ERROR_MESSAGES.DATA_VALIDATION_FAILED.message}\nuserId: ${userId}, \nerrors: ${JSON.stringify(error.issues)}`,
        );

        throw new BusinessException(ERROR_MESSAGES.DATA_VALIDATION_FAILED);
      }

      throw error;
    }
  }
}
