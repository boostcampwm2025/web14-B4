import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';

@Entity('tb_follow_up_question')
export class FollowUpQuestion {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'follow_up_question_id',
  })
  followUpQuestionId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuizId: MainQuiz;

  @Column({ name: 'content', type: 'varchar', length: 255, nullable: true })
  content?: string;
}
