import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TbChecklistItem } from './tb-checklist-item.entity';

@Entity('tb_main_quiz')
export class TbMainQuiz {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'main_quiz_id',
  })
  mainQuizId: number;

  @Column({ name: 'quiz_category_id' })
  quizCategoryId: number;

  @Column({ name: 'difficulty_level', length: 10 })
  difficultyLevel: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'content', length: 255 })
  content: string;

  @Column({ name: 'hint', length: 255, nullable: true })
  hint: string;

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

  @OneToMany(() => TbChecklistItem, (item) => item.mainQuiz)
  checklistItems: TbChecklistItem[];
}
