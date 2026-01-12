import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';
import { UserChecklistProgress } from './tb-user-checklist-progress.entity';

@Entity('tb_checklist_item')
export class ChecklistItem {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'checklist_item_id',
  })
  checklistItemId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuizId: MainQuiz;

  @OneToMany(
    () => UserChecklistProgress,
    (progress) => progress.checklistItemId,
  )
  userProgress: UserChecklistProgress[];

  @Column({ name: 'content', type: 'varchar', length: 255, nullable: true })
  content: string;

  @Column({ name: 'sort_order', type: 'bigint', nullable: true })
  sortOrder: number;

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
}
