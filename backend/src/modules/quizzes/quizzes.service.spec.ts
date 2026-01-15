import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import {
  MainQuiz,
  DifficultyLevel,
} from '../../datasources/entities/tb-main-quiz.entity';
import { ChecklistItem } from '../../datasources/entities/tb-checklist-item.entity';

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

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      getCategoriesWithCount: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findById: jest.fn().mockResolvedValue(null),
      findOneWithChecklist: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        {
          provide: MainQuizRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuizzesService>(QuizzesService);
    repository = module.get(MainQuizRepository);
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
      repository.count.mockResolvedValue(10);

      const result = await service.getCategoriesWithCount();

      expect(result.totalCount).toBe(10);
      expect(result.categories[0].id).toBe(1);
      expect(result.categories[0].count).toBe(5);
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
});
