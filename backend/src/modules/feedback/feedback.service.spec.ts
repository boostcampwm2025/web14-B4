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
import { BusinessException } from 'src/common/exceptions/business.exception';
import { MainQuiz } from 'src/datasources/entities/tb-main-quiz.entity';

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
        {
          provide: 'NestWinston',
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
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
      const longAnswer =
        '이 답변은 테스트를 통과하기 위해 50자 이상으로 작성되었습니다. AI 피드백 생성 로직이 정상적으로 동작하려면 답변 길이가 충분해야 합니다. 하나 둘 셋 넷 다섯.';
      speechesServiceMock.getSolvedQuizInfo.mockResolvedValue(longAnswer);
      usersServiceMock.getUserChecklistProgress.mockResolvedValue(
        mockChecklist,
      );

      generateContentMock.mockResolvedValue({
        text: JSON.stringify({ score: 5 }),
      });

      solvedQuizRepositoryMock.updateAiFeedback.mockResolvedValue(true);
    });
    it('AI 피드백 생성 시, 전체 흐름이 모두 호출된다', async () => {
      await service.generateAIFeedback(requestDto);

      expect(mainQuizRepositoryMock.findByIdWithDetails).toHaveBeenCalledWith(
        1,
      );

      expect(speechesServiceMock.getSolvedQuizInfo).toHaveBeenCalledWith(10);

      expect(usersServiceMock.getUserChecklistProgress).toHaveBeenCalledWith(
        10,
      );

      expect(solvedQuizRepositoryMock.updateAiFeedback).toHaveBeenCalled();
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
      ).rejects.toBeInstanceOf(BusinessException);
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
        BusinessException,
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

describe('FeedbackService', () => {
  let service: FeedbackService;
  let mainQuizRepository: MainQuizRepository;
  let speechesService: SpeechesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: MainQuizRepository,
          useValue: {
            findByIdWithDetails: jest.fn(), // 함수 껍데기만 만듭니다.
          },
        },
        {
          provide: SolvedQuizRepository,
          useValue: {
            updateAiFeedback: jest.fn(),
          },
        },
        {
          provide: SpeechesService,
          useValue: {
            getSolvedQuizInfo: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserChecklistProgress: jest.fn(),
          },
        },
        {
          provide: 'NestWinston',
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<FeedbackService>(FeedbackService);
    mainQuizRepository = module.get<MainQuizRepository>(MainQuizRepository);
    speechesService = module.get<SpeechesService>(SpeechesService);
  });

  describe('generateAIFeedback()', () => {
    it('답변 길이가 50자 미만인 경우 BusinessException을 던져야 한다', async () => {
      const requestDto = {
        mainQuizId: 1,
        solvedQuizId: 1,
      };

      const shortAnswer = '이것은 50자가 안 되는 아주 짧은 답변입니다.';

      jest.spyOn(mainQuizRepository, 'findByIdWithDetails').mockResolvedValue({
        mainQuizId: 1,
        title: '테스트 퀴즈',
        content: '내용',
      } as unknown as MainQuiz);
      jest
        .spyOn(speechesService, 'getSolvedQuizInfo')
        .mockResolvedValue(shortAnswer);

      await expect(service.generateAIFeedback(requestDto)).rejects.toThrow(
        BusinessException,
      );
    });
  });
});
