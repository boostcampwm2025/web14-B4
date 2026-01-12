import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';

@Entity('tb_quiz_keywords')
export class QuizKeyword {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'quiz_keyword_id',
  })
  quizKeywordId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuiz: MainQuiz;

  @Column({ name: 'keyword', type: 'varchar', length: 255 })
  keyword: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;
}
