import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import {
  QuizChecklistResponseDto,
  MultipleChoicesResponseDto,
} from './dto/quiz-response.dto';
import { QuizImportanceDataDto } from './dto/quiz-importance-response.dto';
import {
  MainQuiz,
  DifficultyLevel,
} from '../../datasources/entities/tb-main-quiz.entity';
import { FindOptionsWhere } from 'typeorm';
import { QuizKeyword } from 'src/datasources/entities/tb-quiz-keyword.entity';
import { QuizKeywordRepository } from 'src/datasources/repositories/tb-quiz-keyword.repository';
import { MultipleChoiceRepository } from 'src/datasources/repositories/tb-multiple-choice.repository';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { UserRepository } from 'src/datasources/repositories/tb-user.repository';
import { mapSolvedQuizzesToImportanceData } from './mapper/response-mapper';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly quizRepository: MainQuizRepository,
    private readonly quizKeywordRepository: QuizKeywordRepository,
    private readonly multipleChoiceRepository: MultipleChoiceRepository,
    private readonly solvedQuizRepository: SolvedQuizRepository,
  ) {}

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

  async getCategoriesWithCount(difficulty?: DifficultyLevel) {
    const where: FindOptionsWhere<MainQuiz> = {};

    if (difficulty) where.difficultyLevel = difficulty;

    const result = await this.quizRepository.getCategoriesWithCount(difficulty);

    const categories = result.map((row) => ({
      id: Number(row.id),
      name: row.name,
      count: Number(row.count ?? 0),
    }));

    const totalCount = result.reduce(
      (total, category) => total + Number(category.count),
      0,
    );

    return { totalCount, categories };
  }

  async findOne(id: number): Promise<MainQuiz | undefined> {
    const quiz = await this.quizRepository.findById(id);
    return quiz || undefined;
  }

  async getKeywordsByQuiz(mainQuizId: number): Promise<QuizKeyword[]> {
    const keywords =
      await this.quizKeywordRepository.findByMainQuizId(mainQuizId);
    if (!keywords) throw new NotFoundException(`해당 퀴즈를 찾을 수 없습니다.`);

    return keywords;
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

  async getMultipleChoicesByMainQuizId(
    mainQuizId: number,
  ): Promise<MultipleChoicesResponseDto> {
    const mainQuiz = await this.quizRepository.findById(mainQuizId);
    if (!mainQuiz) {
      throw new BusinessException(ERROR_MESSAGES.MAIN_QUIZ_NOT_FOUND);
    }

    const multipleChoices =
      await this.multipleChoiceRepository.findByMainQuizId(mainQuizId);

    const mapped = multipleChoices.map((mc) => ({
      multipleChoiceId: mc.multipleChoiceId,
      content: mc.content,
      options: mc.options.map((opt) => ({
        multipleQuizOptionId: opt.multipleQuizOptionId,
        option: opt.option,
        isCorrect: Boolean(opt.isCorrect),
        explanation: opt.explanation ?? null,
      })),
    }));

    return {
      mainQuizId,
      totalCount: mapped.length,
      multipleChoices: mapped,
    };
  }

  async getSolvedWithImportance(
    userId: number,
  ): Promise<QuizImportanceDataDto> {
    // userId로 해당 유저가 존재하는지 조회
    const user = await this.userRepository.findById(userId);

    if (user === null)
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND.message);

    const solvedQuiz =
      await this.solvedQuizRepository.getImportanceByUserId(userId);

    return mapSolvedQuizzesToImportanceData(solvedQuiz);
  }
}
