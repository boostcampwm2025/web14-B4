import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { TbMainQuizRepository } from '../../datasources/repositories/tb-main-quiz.respository';
import { QuizFixture } from './quizzes.fixture';

describe('QuizzesService', () => {
  let service: QuizzesService;
  let repository: jest.Mocked<TbMainQuizRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getQuizWithChecklist: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzesService,
        {
          provide: TbMainQuizRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuizzesService>(QuizzesService);
    repository = module.get(TbMainQuizRepository);
  });

  describe('getQuizChecklist', () => {
    it('퀴즈가 존재하지 않으면 NotFoundException을 던진다', async () => {
      // Given
      repository.findOneWithChecklist.mockResolvedValue(null);

      // When & Then
      await expect(service.getQuizChecklist(999)).rejects.toThrow(
        new NotFoundException('해당 퀴즈를 찾을 수 없습니다.'),
      );
    });

    it('퀴즈와 체크리스트를 정상적으로 반환한다', async () => {
      // Given
      const mockQuiz = QuizFixture.createQuiz();
      repository.findOneWithChecklist.mockResolvedValue(mockQuiz);

      // When
      const result = await service.getQuizChecklist(1);

      // Then
      expect(result.mainQuizId).toBe(1);
      expect(result.title).toBe('테스트 퀴즈');
      expect(result.checklistItems).toHaveLength(2);
      expect(result.checklistItems[0].checklistItemId).toBe(1);
    });
  });
});
