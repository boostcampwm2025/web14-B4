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

  createChecklistProgress(
    progress: UserChecklistProgress,
  ): Promise<UserChecklistProgress> {
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

  async saveUserChecklistProgress(
    userId: number,
    solvedQuizId: number,
    checklistItems: {
      checklistItemId: number;
      isChecked: boolean;
    }[],
  ): Promise<void> {
    if (checklistItems.length === 0) return;

    const entities = checklistItems.map((item) =>
      this.repository.create({
        user: { userId },
        checklistItem: { checklistItemId: item.checklistItemId },
        solvedQuiz: { solvedQuizId },
        isChecked: item.isChecked,
        checkedAt: item.isChecked ? new Date() : null,
      }),
    );

    await this.repository.save(entities);
  }

  // solved quiz의 체크리스트를 가져온다
  async getChecklistProgressBySolved(
    solvedQuizId: number,
  ): Promise<UserChecklistProgress[] | null> {
    return this.repository
      .createQueryBuilder('userChecklistProgress')
      .leftJoinAndSelect('userChecklistProgress.checklistItem', 'checklistItem')
      .leftJoin('userChecklistProgress.solvedQuiz', 'solvedQuiz')
      .where('solvedQuiz.solvedQuizId = :solvedQuizId', { solvedQuizId })
      .orderBy('checklistItem.sortOrder', 'ASC')
      .getMany();
  }
}
