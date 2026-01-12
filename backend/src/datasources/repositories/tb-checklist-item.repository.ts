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
        mainQuizId: { mainQuizId },
      },
      order: { sortOrder: 'ASC' },
    });
  }
}
