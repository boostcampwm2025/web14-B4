import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChecklistItem } from '../entities/tb-checklist-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChecklistItemRepository {
  constructor(
    @InjectRepository(ChecklistItem)
    private readonly repository: Repository<ChecklistItem>,
  ) {}

  findByMainQuizId(mainQuizId: number): Promise<ChecklistItem[]> {
    return this.repository.find({
      where: {
        mainQuiz: { mainQuizId },
      },
      order: { sortOrder: 'ASC' },
    });
  }

  getUserChecklistItems(
    userId: number,
    mainQuizId: number,
    solvedQuizId: number,
  ) {
    return this.repository
      .createQueryBuilder('checklistItem')
      .select(['checklistItem.checklistItemId', 'checklistItem.content'])
      .leftJoin(
        'checklistItem.userProgress',
        'userChecklistProgress',
        'userChecklistProgress.user.userId = :userId AND userChecklistProgress.solvedQuiz.solvedQuizId = :solvedQuizId AND userChecklistProgress.isChecked = :isChecked',
        { userId, solvedQuizId, isChecked: true },
      )
      .leftJoin('checklistItem.mainQuiz', 'mainQuiz')
      .where('mainQuiz.mainQuizId = :mainQuizId', { mainQuizId })
      .orderBy('checklistItem.sortOrder', 'ASC')
      .getMany();
  }
}
