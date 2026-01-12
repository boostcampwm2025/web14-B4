import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';

@Entity('tb_solved_quiz')
export class SolvedQuiz {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'solved_quiz_id',
  })
  solvedQuizId: number;

  @Column('bigint', { name: 'user_id' })
  // TODO: User Entity 생성 후 외래키로 추가
  userId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuiz: MainQuiz;

  @Column('text', { name: 'speech_text' })
  speechText: string;

  @CreateDateColumn()
  createdAt: Date;
}
