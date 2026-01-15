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

  // 사용자가 체크한 체크리스트를 조회
  getUserChecklistItems(
    userId: number,
    mainQuizId: number,
    solvedQuizId: number,
  ): Promise<ChecklistItem[] | null> {
    return this.repository
      .createQueryBuilder('checklistItem')
      .select(['checklistItem.checklistItemId', 'checklistItem.content'])
      .leftJoin('checklistItem.userProgress', 'userChecklistProgress')
      .leftJoin('userChecklistProgress.user', 'user')
      .leftJoin('userChecklistProgress.solvedQuiz', 'solvedQuiz')
      .leftJoin('checklistItem.mainQuiz', 'mainQuiz')
      .where('mainQuiz.mainQuizId = :mainQuizId', { mainQuizId })
      .andWhere('user.userId = :userId', { userId })
      .andWhere('solvedQuiz.solvedQuizId = :solvedQuizId', { solvedQuizId })
      .andWhere('userChecklistProgress.isChecked = :isChecked', {
        isChecked: true,
      })
      .orderBy('checklistItem.sortOrder', 'ASC')
      .getMany();
  }
}
