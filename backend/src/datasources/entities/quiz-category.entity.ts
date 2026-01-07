import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MainQuizEntity } from './main-quiz.entity';

@Entity('tb_quiz_category')
export class QuizCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'quiz_category_id', type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => MainQuizEntity, (quiz) => quiz.category)
  quizzes: MainQuizEntity[];
}
