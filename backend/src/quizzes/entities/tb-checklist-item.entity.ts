import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TbMainQuiz } from './tb-main-quiz.entity';
import { TbUserChecklistProgress } from '../../users/entities/tb-user-checklist-progress.entity';

@Entity('tb_checklist_item')
export class TbChecklistItem {
  @PrimaryGeneratedColumn({ name: 'checklist_item_id' })
  checklistItemId: number;

  @Column({ name: 'main_quiz_id' })
  mainQuizId: number;

  @Column({ name: 'content', length: 255, nullable: true })
  content: string;

  @Column({ name: 'sort_order', nullable: true })
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

  @ManyToOne(() => TbMainQuiz, (quiz) => quiz.checklistItems)
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuiz: TbMainQuiz;

  @OneToMany(
    () => TbUserChecklistProgress,
    (progress) => progress.checklistItem,
  )
  userProgress: TbUserChecklistProgress[];
}
