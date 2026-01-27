import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';
import { User } from './tb-user.entity';

export enum ComprehensionLevel {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
}

export enum Importance {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
}

export enum SolvedState {
  NOT_STARTED = 'NOT_STARTED', // 시작 전(나의 답변 + 체크리스트 제출 전)
  IN_PROGRESS = 'IN_PROGRESS', // 진행 중 (AI 피드백 생성)
  COMPLETED = 'COMPLETED', // 풀이 완료 (AI 피드백 확인 후, 끝내기 완료)
  FAILED = 'FAILED', // 풀이 실패
}

@Entity('tb_solved_quiz')
export class SolvedQuiz {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'solved_quiz_id',
  })
  solvedQuizId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuiz: MainQuiz;

  @Column('text', { name: 'speech_text' })
  speechText: string;

  @Column({
    name: 'comprehension_level',
    type: 'enum',
    enum: ComprehensionLevel,
    nullable: true,
  })
  comprehensionLevel?: ComprehensionLevel;

  @Column({
    name: 'importance',
    type: 'enum',
    enum: Importance,
    nullable: false,
    default: Importance.NORMAL,
  })
  importance?: Importance;

  @Column('jsonb', { name: 'ai_feedback', nullable: true })
  aiFeedback: unknown;

  @Column({
    name: 'solved_state',
    type: 'enum',
    enum: SolvedState,
    nullable: false,
    default: SolvedState.NOT_STARTED,
  })
  solvedState: SolvedState;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
