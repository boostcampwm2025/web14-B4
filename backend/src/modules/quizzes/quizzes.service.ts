import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import { QuizChecklistResponseDto } from './dto/quiz-response.dto';
import {
  MainQuiz,
  DifficultyLevel,
} from '../../datasources/entities/tb-main-quiz.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizRepository: MainQuizRepository) {}

  async getQuizzes(
    category?: string,
    difficulty?: DifficultyLevel,
  ): Promise<MainQuiz[]> {
    const where: FindOptionsWhere<MainQuiz> = {};

    if (category) {
      where.quizCategory = { name: category };
    }

    if (difficulty) {
      where.difficultyLevel = difficulty;
    }

    return await this.quizRepository.find({
      where,
      relations: ['quizCategory'],
      order: { mainQuizId: 'ASC' },
    });
  }

  async getCategoriesWithCount() {
    const result = await this.quizRepository.getCategoriesWithCount();
    const totalCount = await this.quizRepository.count();

    const categories = result.map((row) => ({
      id: Number(row.id),
      name: row.name,
      count: Number(row.count ?? 0),
    }));

    return { totalCount, categories };
  }

  async findOne(id: number): Promise<MainQuiz | undefined> {
    const quiz = await this.quizRepository.findById(id);
    return quiz || undefined;
  }

  async getQuizChecklist(mainQuizId: number) {
    const quiz = await this.quizRepository.findOneWithChecklist(mainQuizId);

    if (!quiz) {
      throw new NotFoundException(`해당 퀴즈를 찾을 수 없습니다.`);
    }

    if (quiz.checklistItems.length <= 0)
      throw new NotFoundException(
        `해당 퀴즈에 대한 체크리스트가 존재하지 않습니다.`,
      );

    return new QuizChecklistResponseDto({
      mainQuizId: quiz.mainQuizId,
      title: quiz.title,
      content: quiz.content,
      difficultyLevel: quiz.difficultyLevel,
      checklistItems: quiz.checklistItems.map((item) => ({
        checklistItemId: item.checklistItemId,
        sortOrder: Number(item.sortOrder),
        content: item.content,
      })),
    });
  }
}
