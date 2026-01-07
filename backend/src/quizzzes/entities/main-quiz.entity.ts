import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuizCategoryEntity } from './quiz-category.entity';

export enum DifficultyLevel {
    HIGH = '상',
    MID = '중',
    LOW = '하',
}

@Entity('tb_main_quiz')
export class MainQuizEntity {
    @PrimaryGeneratedColumn({ name: 'main_quiz_id', type: 'bigint' })
    id: number;

    @Column({ name: 'title', type: 'varchar', length: 255 })
    title: string;

    @Column({ name: 'content', type: 'varchar', length: 255 })
    content: string;

    @Column({ name: 'hint', type: 'varchar', length: 255, nullable: true })
    hint: string | null;

    @Column({ name: 'difficulty_level', type: 'enum', enum: DifficultyLevel })
    difficulty: DifficultyLevel;

    @ManyToOne(() => QuizCategoryEntity, (category) => category.quizzes, {
        eager: true,
    })
    @JoinColumn({ name: 'quiz_category_id' })
    category: QuizCategoryEntity;
}