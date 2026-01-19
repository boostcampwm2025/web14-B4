import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DifficultyLevel, MainQuiz } from '../entities/tb-main-quiz.entity';

export interface CategoryCountResult {
  id: string;
  name: string;
  count: string;
}

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

  getCategoriesWithCount(
    difficulty?: DifficultyLevel,
  ): Promise<CategoryCountResult[]> {
    const qb = this.createQueryBuilder('mq')
      .leftJoin('mq.quizCategory', 'qc')
      .select('qc.quizCategoryId', 'id')
      .addSelect('qc.name', 'name')
      .addSelect('COUNT(mq.mainQuizId)', 'count')
      .groupBy('qc.quizCategoryId')
      .addGroupBy('qc.name');

    if (difficulty) {
      qb.andWhere('mq.difficultyLevel = :difficulty', { difficulty });
    }

    return qb.getRawMany<CategoryCountResult>();
  }
}
