import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column('bigint', { name: 'main_quiz_id' })
  // TODO: mainQuiz Entity 생성 후 외래키로 추가
  mainQuizId: number;

  @Column('text', { name: 'speech_text' })
  speechText: string;

  @CreateDateColumn()
  createdAt: Date;
}
