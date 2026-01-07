import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TbChecklistItem } from './tb-checklist-item.entity';

@Entity('tb_user_checklist_progress')
@Unique(['userId', 'checklistItemId'])
export class TbUserChecklistProgress {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'user_checklist_progress_id',
  })
  userChecklistProgressId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'checklist_item_id' })
  checklistItemId: number;

  @Column({ name: 'is_checked', default: false })
  isChecked: boolean;

  @Column({ name: 'checked_at', type: 'timestamp', nullable: true })
  checkedAt: Date | null;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => TbChecklistItem, (item) => item.userProgress)
  @JoinColumn({ name: 'checklist_item_id' })
  checklistItem: TbChecklistItem;
}
