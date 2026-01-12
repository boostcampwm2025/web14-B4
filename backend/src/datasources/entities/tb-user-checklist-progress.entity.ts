import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChecklistItem } from './tb-checklist-item.entity';
import { User } from './tb-user.entity';

@Entity('tb_user_checklist_progress')
@Unique('uk_user_checklist_quiz', ['userId', 'checklistItemId', 'solvedQuizId'])
export class UserChecklistProgress {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'user_checklist_progress_id',
  })
  userChecklistProgressId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => ChecklistItem, { nullable: false })
  @JoinColumn({ name: 'checklist_item_id' })
  checklistItemId: ChecklistItem;

  // FK 등록 x
  @Column({ name: 'solved_quiz_id' })
  solvedQuizId: number;

  @Column({ name: 'is_checked', default: false, nullable: true })
  isChecked: boolean;

  @Column({ name: 'checked_at', type: 'timestamp', nullable: true })
  checkedAt: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
