import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tb_quiz_category')
export class QuizCategory {
  @PrimaryGeneratedColumn('increment', {
    name: 'quiz_category_id',
    type: 'bigint',
  })
  quizCategoryId: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;
}
