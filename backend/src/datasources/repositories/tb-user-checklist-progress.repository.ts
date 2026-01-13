import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserChecklistProgress } from '../entities/tb-user-checklist-progress.entity';

@Injectable()
export class UserChecklistProgressRepository {
  constructor(
    @InjectRepository(UserChecklistProgress)
    private readonly repository: Repository<UserChecklistProgress>,
  ) {}

  save(progress: UserChecklistProgress): Promise<UserChecklistProgress> {
    return this.repository.save(progress);
  }

  findByUserId(userId: number): Promise<UserChecklistProgress[]> {
    return this.repository.find({
      where: {
        user: { userId },
      },
      relations: ['checklistItem', 'userId'],
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
