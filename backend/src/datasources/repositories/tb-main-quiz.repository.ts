import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DifficultyLevel, MainQuiz } from '../entities/tb-main-quiz.entity';
import { z } from 'zod';

export interface CategoryCountResult {
  id: string;
  name: string;
  count: string;
}

const AggregationItemSchema = z
  .object({
    category: z.string(),
    count: z.string().transform((val) => Number(val)),
  })
  .strict();

const AggregationsRawSchema = z.array(AggregationItemSchema);

const AggregationsResultSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().nullable(),
      count: z.number(),
    }),
  ),
  total: z.number(),
});

type AggregationsResult = z.infer<typeof AggregationsResultSchema>;

@Injectable()
export class MainQuizRepository extends Repository<MainQuiz> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(MainQuiz, dataSource.createEntityManager());
  }

  async findById(mainQuizId: number): Promise<MainQuiz | null> {
    return this.findOne({
      where: { mainQuizId },
      relations: ['quizCategory', 'checklistItems'],
    });
  }

  async findOneWithChecklist(mainQuizId: number) {
    return this.createQueryBuilder('mq')
      .leftJoinAndSelect('mq.checklistItems', 'ci')
      .where('mq.mainQuizId = :mainQuizId', { mainQuizId })
      .orderBy('ci.sortOrder', 'ASC')
      .getOne();
  }

  async findByIdWithDetails(mainQuizId: number) {
    return this.createQueryBuilder('mainQuiz')
      .select([
        'mainQuiz.mainQuizId',
        'mainQuiz.title',
        'mainQuiz.content',
        'mainQuiz.hint',
        'mainQuiz.difficultyLevel',
      ])
      .leftJoinAndSelect('mainQuiz.quizCategory', 'quizCategory')
      .leftJoinAndSelect('mainQuiz.keywords', 'keywords')
      .leftJoin('mainQuiz.checklistItems', 'checklistItem')
      .addSelect(['checklistItem.checklistItemId', 'checklistItem.content'])
      .where('mainQuiz.mainQuizId = :id', { id: mainQuizId })
      .getOne();
  }

  async getAggregations(
    difficulty?: DifficultyLevel,
  ): Promise<AggregationsResult> {
    const baseQuery = this.createQueryBuilder('quiz').leftJoin(
      'quiz.quizCategory',
      'category',
    );

    if (difficulty) {
      baseQuery.andWhere('quiz.difficultyLevel = :difficulty', { difficulty });
    }

    const [categoriesRaw, total] = await Promise.all([
      baseQuery
        .clone()
        .select('category.name', 'category')
        .addSelect('COUNT(*)', 'count')
        .groupBy('category.name')
        .getRawMany(),

      baseQuery.clone().getCount(),
    ]);

    // Raw 데이터 검증
    const validated = AggregationsRawSchema.parse(categoriesRaw);

    // 최종 결과 구조 변환 및 검증
    const result = AggregationsResultSchema.parse({
      categories: validated.map((c) => ({
        name: c.category,
        count: c.count,
      })),
      total,
    });

    return result;
  }
}
