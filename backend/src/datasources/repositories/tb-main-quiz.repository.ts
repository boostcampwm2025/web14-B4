import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { MainQuiz } from '../entities/tb-main-quiz.entity';

@Injectable()
export class MainQuizRepository extends Repository<MainQuiz> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(MainQuiz, dataSource.createEntityManager());
  }

  async findById(mainQuizId: number) {
    return this.findOne({
      where: { mainQuizId: mainQuizId },
      relations: ['checklistItems'],
    });
  }

  async findOneWithChecklist(mainQuizId: number) {
    return this.createQueryBuilder('mq')
      .leftJoinAndSelect('mq.checklistItems', 'ci')
      .where('mq.mainQuizId = :mainQuizId', { mainQuizId })
      .orderBy('ci.sortOrder', 'ASC')
      .getOne();
  }
}
