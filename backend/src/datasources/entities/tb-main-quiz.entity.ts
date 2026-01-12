import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { ChecklistItem } from './tb-checklist-item.entity';
import { QuizCategory } from './tb-quiz-category.entity';

export enum DifficultyLevel {
  HARD = '상',
  MEDIUM = '중',
  EASY = '하',
}

@Entity('tb_main_quiz')
export class MainQuiz {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'main_quiz_id',
  })
  mainQuizId: number;

  @OneToOne(() => QuizCategory, {
    eager: true,
    nullable: false, 
  })
  @JoinColumn({ name: 'quiz_category_id' }) 
  quizCategory: QuizCategory;

  @Column({ name: 'difficulty_level', type: 'enum', enum: DifficultyLevel })
  difficultyLevel: DifficultyLevel;

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

  @OneToMany(() => ChecklistItem, (item) => item.mainQuiz)
  checklistItems: ChecklistItem[];

  getChecklistItemIds(): number[] {
    return this.checklistItems.map((item) => item.checklistItemId);
  }

  validateChecklistItem(checklistItemId: number): boolean {
    return this.checklistItems.some(
      (item) => Number(item.checklistItemId) === checklistItemId,
    );
  }

  validateAllChecklistItems(checklistItemIds: number[]): boolean {
    return checklistItemIds.every((id) => this.validateChecklistItem(id));
  }
}
