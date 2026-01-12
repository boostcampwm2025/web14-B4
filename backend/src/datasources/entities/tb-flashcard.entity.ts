import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';

@Entity('tb_flashcard')
export class Flashcard {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'flashcard_id',
  })
  flashcardId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuizId: MainQuiz;

  @Column({ name: 'content', type: 'varchar', length: 255, nullable: true })
  content?: string;

  @Column({ name: 'answer', type: 'varchar', length: 255, nullable: true })
  answer?: string;
}
