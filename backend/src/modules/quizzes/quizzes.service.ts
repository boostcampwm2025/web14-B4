import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import {
  QuizChecklistResponseDto,
  MultipleChoicesResponseDto,
} from './dto/quiz-response.dto';
import { QuizImportanceDataDto } from './dto/quiz-importance-response.dto';
import { MainQuiz } from '../../datasources/entities/tb-main-quiz.entity';
import { QuizKeyword } from 'src/datasources/entities/tb-quiz-keyword.entity';
import { QuizKeywordRepository } from 'src/datasources/repositories/tb-quiz-keyword.repository';
import { MultipleChoiceRepository } from 'src/datasources/repositories/tb-multiple-choice.repository';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { UserRepository } from 'src/datasources/repositories/tb-user.repository';
import { mapSolvedQuizzesToImportanceData } from './mapper/response-mapper';
import { CursorPaginatedResult } from 'src/common/interfaces/pagination.interface';
import { QuizFilterDto, QuizInfiniteScrollDto } from './dto/quiz-search.dto';
import { createCursorPaginatedResult } from 'src/common/utils/pagination.util';
import { QuizCategory } from 'src/datasources/entities/tb-quiz-category.entity';
import { QuizCategoryRepository } from 'src/datasources/repositories/tb-quiz-category.repository';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly quizRepository: MainQuizRepository,
    private readonly quizCategoryRepository: QuizCategoryRepository,
    private readonly quizKeywordRepository: QuizKeywordRepository,
    private readonly multipleChoiceRepository: MultipleChoiceRepository,
    private readonly solvedQuizRepository: SolvedQuizRepository,
  ) {}

  async getQuizzes(
    searchDto: QuizInfiniteScrollDto,
  ): Promise<CursorPaginatedResult<MainQuiz>> {
    const { cursor, limit, category, difficulty } = searchDto;
    const take = limit + 1; // 다음 페이지 확인용 +1

    const queryBuilder = this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.quizCategory', 'category') // 카테고리 조인
      .orderBy('quiz.mainQuizId', 'ASC');

    // 커서가 있으면 해당 ID 이후부터
    if (cursor) {
      queryBuilder.andWhere('quiz.mainQuizId > :cursor', { cursor });
    }

    if (category && typeof category === 'string') {
      queryBuilder.andWhere('category.name = :category', { category });
    }

    if (difficulty) {
      queryBuilder.andWhere('quiz.difficultyLevel = :difficulty', {
        difficulty,
      });
    }

    const data = await queryBuilder.take(take).getMany();

    return createCursorPaginatedResult(data, limit, 'mainQuizId');
  }

  async getAggregations(dto: QuizFilterDto) {
    const { categories, total } = await this.quizRepository.getAggregations(
      dto.difficulty,
    );

    return {
      categories: categories.map((c) => ({
        name: c.name,
        count: c.count,
      })),
      total,
    };
  }

  async getQuizCategories(): Promise<QuizCategory[]> {
    const categories = await this.quizCategoryRepository.findAll();
    return categories;
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
