import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TbUserChecklistProgress } from '../entities/tb-user-checklist-progress.entity';

@Injectable()
export class TbUserChecklistProgressRepository extends Repository<TbUserChecklistProgress> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(TbUserChecklistProgress, dataSource.createEntityManager());
  }
}
