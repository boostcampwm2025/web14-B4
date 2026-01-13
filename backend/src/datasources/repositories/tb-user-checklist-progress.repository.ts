import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserChecklistProgress } from '../entities/tb-user-checklist-progress.entity';

@Injectable()
export class UserChecklistProgressRepository extends Repository<UserChecklistProgress> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(UserChecklistProgress, dataSource.createEntityManager());
  }
}
