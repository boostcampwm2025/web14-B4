import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TbMainQuiz } from '../entities/tb-main-quiz.entity';

@Injectable()
export class TbMainQuizRepository extends Repository<TbMainQuiz> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(TbMainQuiz, dataSource.createEntityManager());
  }

  async getQuizWithChecklist(mainQuizId: number) {
    return this.createQueryBuilder('mq')
      .leftJoinAndSelect('mq.checklistItems', 'ci')
      .where('mq.mainQuizId = :mainQuizId', { mainQuizId })
      .orderBy('ci.sortOrder', 'ASC')
      .getOne();
  }
}
