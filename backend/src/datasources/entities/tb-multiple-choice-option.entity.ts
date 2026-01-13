import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MultipleChoice } from './tb-multiple-choice.entity';

@Entity('tb_multiple_choice_option')
export class MultipleChoiceOption {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'multiple_quiz_option_id',
  })
  multipleQuizOptionId: number;

  @ManyToOne(() => MultipleChoice, { nullable: false })
  @JoinColumn({ name: 'multiple_choice_id' })
  multipleChoice: MultipleChoice;

  @Column({ name: 'option', type: 'varchar', length: 255 })
  option: string;

  @Column({ name: 'is_correct', type: 'boolean', nullable: true })
  isCorrect?: boolean;
}
