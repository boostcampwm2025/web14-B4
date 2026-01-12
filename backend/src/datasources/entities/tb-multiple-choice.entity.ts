import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';
import { MultipleChoiceOption } from './tb-multiple-choice-option.entity';

@Entity('tb_multiple_choice')
export class MultipleChoice {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'multiple_choice_id',
  })
  multipleChoiceId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuizId: MainQuiz;

  @Column({ name: 'content', type: 'varchar', length: 255, nullable: true })
  content?: string;

  @OneToMany(() => MultipleChoiceOption, (option) => option.multipleChoiceId)
  options: MultipleChoiceOption[];
}
