import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import {
  MainQuiz,
  DifficultyLevel,
} from '../../datasources/entities/tb-main-quiz.entity';
import { ChecklistItem } from '../../datasources/entities/tb-checklist-item.entity';
import { DeepPartial } from 'typeorm';
import { MultipleChoiceRepository } from '../../datasources/repositories/tb-multiple-choice.repository';
import { MultipleChoice } from '../../datasources/entities/tb-multiple-choice.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { QuizKeywordRepository } from '../../datasources/repositories/tb-quiz-keyword.repository';
import { UserRepository } from '../../datasources/repositories/tb-user.repository';
import { SolvedQuizRepository } from '../../datasources/repositories/tb-solved-quiz.repository';

const createMockQuiz = (overrides?: Partial<MainQuiz>): MainQuiz => {
  return {
    mainQuizId: 1,
    title: '테스트 퀴즈',
    content: '테스트 내용',
    hint: '테스트 힌트',
    difficultyLevel: DifficultyLevel.EASY,
    quizCategory: { quizCategoryId: 1, name: '운영체제' },
    checklistItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    created_by: 1,
    ...overrides,
  } as MainQuiz;
};

describe('QuizzesService', () => {
  let service: QuizzesService;
  let repository: jest.Mocked<MainQuizRepository>;
  let multipleChoiceRepository: jest.Mocked<MultipleChoiceRepository>;
  let _quizKeywordRepository: jest.Mocked<QuizKeywordRepository>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      getCategoriesWithCount: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findById: jest.fn().mockResolvedValue(null),
      findOneWithChecklist: jest.fn().mockResolvedValue(null),
    };

    const mockMultipleChoiceRepository = {
      findByMainQuizId: jest.fn().mockResolvedValue([]),
    };

    const mockQuizKeywordRepository = {
      findByMainQuizId: jest.fn().mockResolvedValue([]),
    };

    const mockUserRepository = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const mockSolvedQuizRepository = {
      getImportanceByUserId: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        {
          provide: MainQuizRepository,
          useValue: mockRepository,
        },
        {
          provide: QuizKeywordRepository,
          useValue: mockQuizKeywordRepository,
        },
        {
          provide: MultipleChoiceRepository,
          useValue: mockMultipleChoiceRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: SolvedQuizRepository,
          useValue: mockSolvedQuizRepository,
        },
      ],
    }).compile();

    service = module.get<QuizzesService>(QuizzesService);
    repository = module.get(MainQuizRepository);
    _quizKeywordRepository = module.get(QuizKeywordRepository);
    multipleChoiceRepository = module.get(MultipleChoiceRepository);
  });

  describe('getQuizzes', () => {
    it('필터 조건 없이 모든 퀴즈를 반환한다', async () => {
      const mockQuizzes = [createMockQuiz()];
      repository.find.mockResolvedValue(mockQuizzes);

      const result = await service.getQuizzes();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockQuizzes);
    });

    it('카테고리와 난이도로 필터링하여 조회한다', async () => {
      repository.find.mockResolvedValue([]);

      await service.getQuizzes('운영체제', DifficultyLevel.EASY);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          where: expect.objectContaining({
            quizCategory: { name: '운영체제' },
            difficultyLevel: DifficultyLevel.EASY,
          }),
        }),
      );
    });
  });

  describe('getCategoriesWithCount', () => {
    it('카테고리별 개수와 전체 개수를 반환한다', async () => {
      repository.getCategoriesWithCount.mockResolvedValue([
        { id: '1', name: '네트워크', count: '5' },
      ]);

      const result = await service.getCategoriesWithCount();

      expect(result.totalCount).toBe(5);
      expect(result.categories).toEqual([
        { id: 1, name: '네트워크', count: 5 },
      ]);
    });
  });

  describe('findOne', () => {
    it('ID로 퀴즈를 조회한다', async () => {
      const mockQuiz = createMockQuiz();
      repository.findById.mockResolvedValue(mockQuiz);

      const result = await service.findOne(1);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockQuiz);
    });

    it('퀴즈가 없으면 undefined를 반환한다', async () => {
      repository.findById.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeUndefined();
    });
  });

  describe('getQuizChecklist', () => {
    it('퀴즈가 존재하지 않으면 NotFoundException을 던진다', async () => {
      repository.findOneWithChecklist.mockResolvedValue(null);

      await expect(service.getQuizChecklist(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('체크리스트가 없으면 NotFoundException을 던진다', async () => {
      const quizWithNoChecklist = createMockQuiz({ checklistItems: [] });
      repository.findOneWithChecklist.mockResolvedValue(quizWithNoChecklist);

      await expect(service.getQuizChecklist(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('정상적인 체크리스트를 반환한다', async () => {
      const mockChecklistItem = {
        checklistItemId: 1,
        content: '체크1',
        sortOrder: 1,
        mainQuizId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as ChecklistItem;

      const quizWithChecklist = createMockQuiz({
        checklistItems: [mockChecklistItem],
      });

      repository.findOneWithChecklist.mockResolvedValue(quizWithChecklist);

      const result = await service.getQuizChecklist(1);

      expect(result.checklistItems[0].checklistItemId).toBe(1);
      expect(result.title).toBe('테스트 퀴즈');
    });
  });

  describe('getMultipleChoicesByMainQuizId', () => {
    it('[오류] 메인 퀴즈가 없으면 MAIN_QUIZ_NOT_FOUND BusinessException을 던진다', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getMultipleChoicesByMainQuizId(1)).rejects.toEqual(
        new BusinessException(ERROR_MESSAGES.MAIN_QUIZ_NOT_FOUND),
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findById).toHaveBeenCalledWith(1);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(multipleChoiceRepository.findByMainQuizId).not.toHaveBeenCalled();
    });

    it('[정상] 메인 퀴즈가 있으면 multipleChoices를 조회하고 응답 DTO로 매핑한다', async () => {
      repository.findById.mockResolvedValue(createMockQuiz({ mainQuizId: 1 }));

      const mockMultipleChoices: DeepPartial<MultipleChoice>[] = [
        {
          multipleChoiceId: 10,
          content: '객관식 퀴즈 1',
          options: [
            {
              multipleQuizOptionId: 100,
              option: '선택지 1',
              isCorrect: true,
              explanation: '설명',
            },
            {
              multipleQuizOptionId: 101,
              option: '선택지 2',
              isCorrect: false,
              explanation: undefined,
            },
          ],
        },
        {
          multipleChoiceId: 11,
          content: '객관식 퀴즈 2',
          options: [
            {
              multipleQuizOptionId: 102,
              option: '선택지 1',
              isCorrect: true,
              explanation: undefined,
            },
          ],
        },
      ];

      multipleChoiceRepository.findByMainQuizId.mockResolvedValue(
        mockMultipleChoices as unknown as MultipleChoice[],
      );

      const result = await service.getMultipleChoicesByMainQuizId(1);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findById).toHaveBeenCalledWith(1);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(multipleChoiceRepository.findByMainQuizId).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        mainQuizId: 1,
        totalCount: 2,
        multipleChoices: [
          {
            multipleChoiceId: 10,
            content: '객관식 퀴즈 1',
            options: [
              {
                multipleQuizOptionId: 100,
                option: '선택지 1',
                isCorrect: true,
                explanation: '설명',
              },
              {
                multipleQuizOptionId: 101,
                option: '선택지 2',
                isCorrect: false,
                explanation: null,
              },
            ],
          },
          {
            multipleChoiceId: 11,
            content: '객관식 퀴즈 2',
            options: [
              {
                multipleQuizOptionId: 102,
                option: '선택지 1',
                isCorrect: true,
                explanation: null,
              },
            ],
          },
        ],
      });
    });

    it('[정상] multipleChoices가 빈 배열이면 totalCount=0, multipleChoices=[]를 반환한다', async () => {
      repository.findById.mockResolvedValue(createMockQuiz({ mainQuizId: 1 }));

      multipleChoiceRepository.findByMainQuizId.mockResolvedValue(
        [] as unknown as MultipleChoice[],
      );

      const result = await service.getMultipleChoicesByMainQuizId(1);

      expect(result).toEqual({
        mainQuizId: 1,
        totalCount: 0,
        multipleChoices: [],
      });
    });
  });
});
