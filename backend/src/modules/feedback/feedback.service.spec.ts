import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { MainQuizRepository } from 'src/datasources/repositories/tb-main-quiz.repository';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { SpeechesService } from '../speeches/speeches.service';
import { UsersService } from '../users/users.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

// GoogleGenAI mock
const generateContentMock = jest.fn();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: generateContentMock,
    },
  })),
}));

describe('FeedbackService', () => {
  let service: FeedbackService;
  // Use plain mock objects to avoid unbound-method lint issues
  const mainQuizRepositoryMock = {
    findByIdWithDetails: jest.fn(),
  };
  const solvedQuizRepositoryMock = {
    updateAiFeedback: jest.fn(),
  };
  const speechesServiceMock = {
    getSolvedQuizInfo: jest.fn(),
  };
  const usersServiceMock = {
    getUserChecklistProgress: jest.fn(),
  };

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: MainQuizRepository,
          useValue: mainQuizRepositoryMock,
        },
        {
          provide: SolvedQuizRepository,
          useValue: solvedQuizRepositoryMock,
        },
        {
          provide: SpeechesService,
          useValue: speechesServiceMock,
        },
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    service = module.get(FeedbackService);

    jest.clearAllMocks();
  });

  describe('generateAIFeedback()', () => {
    const requestDto = {
      mainQuizId: 1,
      solvedQuizId: 10,
    };

    const mockMainQuiz = {
      mainQuizId: 1,
      content: '퀴즈 내용',
      keywords: [{ keyword: 'HTTP' }],
    } as unknown;

    const mockChecklist = [
      {
        isChecked: true,
        checklistItem: {
          checklistItemId: 1,
          content: '키워드 설명',
        },
      },
      {
        isChecked: false,
        checklistItem: {
          checklistItemId: 2,
          content: '추가 설명',
        },
      },
    ] as unknown;

    beforeEach(() => {
      mainQuizRepositoryMock.findByIdWithDetails.mockResolvedValue(
        mockMainQuiz,
      );
      speechesServiceMock.getSolvedQuizInfo.mockResolvedValue('사용자 답변');
      usersServiceMock.getUserChecklistProgress.mockResolvedValue(
        mockChecklist,
      );

      generateContentMock.mockResolvedValue({
        text: JSON.stringify({ score: 5 }),
      });

      solvedQuizRepositoryMock.updateAiFeedback.mockResolvedValue(true);
    });
    it('AI 피드백 생성 시, 전체 흐름이 모두 호출된다', async () => {
      const result = await service.generateAIFeedback(requestDto);

      expect(mainQuizRepositoryMock.findByIdWithDetails).toHaveBeenCalledWith(
        1,
      );

      expect(speechesServiceMock.getSolvedQuizInfo).toHaveBeenCalledWith(10);

      expect(usersServiceMock.getUserChecklistProgress).toHaveBeenCalledWith(
        10,
      );

      expect(solvedQuizRepositoryMock.updateAiFeedback).toHaveBeenCalled();

      // createTxtForAi / toChecklistResponse 간접 검증
      expect(result.data.userChecklistProgress).toEqual([
        {
          checklistItemId: 1,
          content: '키워드 설명',
        },
      ]);

      expect(result.result).toEqual({ score: 5 });
    });

    it('데이터 조회 실패 시 NotFoundException 발생', async () => {
      mainQuizRepositoryMock.findByIdWithDetails.mockResolvedValue(null);

      await expect(
        service.generateAIFeedback(requestDto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('AI 호출 실패 시 InternalServerErrorException 발생', async () => {
      generateContentMock.mockRejectedValue(new Error('AI error'));

      await expect(
        service.generateAIFeedback(requestDto),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('AI 피드백 저장 실패 시 InternalServerErrorException 발생', async () => {
      solvedQuizRepositoryMock.updateAiFeedback.mockResolvedValue(false);

      await expect(
        service.generateAIFeedback(requestDto),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('analyzeAnswer()', () => {
    it('AI 응답 JSON 파싱 실패하면 예외가 발생한다', async () => {
      generateContentMock.mockResolvedValue({
        text: 'invalid-json',
      });

      await expect(service.analyzeAnswer('test')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('updateAiFeedback()', () => {
    it('ai 피드백이 성공적으로 저장된다. ', async () => {
      solvedQuizRepositoryMock.updateAiFeedback.mockResolvedValue(true);

      await expect(
        service.updateAiFeedback(1, { score: 5 }),
      ).resolves.not.toThrow();
    });

    it('ai 피드백 저장 실패 시 InternalServerErrorException 발생한다', async () => {
      solvedQuizRepositoryMock.updateAiFeedback.mockResolvedValue(false);

      await expect(
        service.updateAiFeedback(1, { score: 5 }),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });
});
