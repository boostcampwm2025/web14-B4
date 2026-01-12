import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SolvedQuiz } from './tb-solved-quiz.entity';

export enum Provider {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
}

@Entity('tb_user')
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  userId: number;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ name: 'username', type: 'varchar', length: 255 })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'level', type: 'varchar', length: 255, nullable: true })
  level?: string;

  @Column({
    name: 'interest_area',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  interestArea?: string;

  @Column({
    name: 'provider',
    type: 'enum',
    enum: Provider,
    nullable: true,
  })
  provider?: Provider;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 관리자가 유저를 생성하는 경우
  @Column({ name: 'created_by', type: 'bigint' })
  createdBy: number;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  // 관리자가 유저를 수정하는 경우
  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy?: number;

  @OneToMany(() => SolvedQuiz, (solved) => solved.user)
  solvedQuizzes: SolvedQuiz[];
}
