import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MainQuiz } from './tb-main-quiz.entity';

@Entity('tb_multiple_choice')
export class MultipleChoice {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'multiple_choice_id',
  })
  multipleChoiceId: number;

  @ManyToOne(() => MainQuiz, { nullable: false })
  @JoinColumn({ name: 'main_quiz_id' })
  mainQuiz: MainQuiz;

  @Column({ name: 'content', type: 'varchar', length: 255, nullable: true })
  content?: string;

  // @OneToMany(() => MultipleChoiceOption, (option) => option.MultipleChoice)
  // options: MultipleChoiceOption[];
}
