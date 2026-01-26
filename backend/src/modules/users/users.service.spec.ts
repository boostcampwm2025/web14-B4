import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { UserChecklistProgressRepository } from '../../datasources/repositories/tb-user-checklist-progress.repository';
import { ChecklistItemRepository } from 'src/datasources/repositories/tb-checklist-item.repository';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { Importance } from '../../datasources/entities/tb-solved-quiz.entity';

describe('UsersService.saveImportance', () => {
  let service: UsersService;

  const mainQuizRepository = {
    findById: jest.fn(),
  };

  const solvedQuizRepository = {
    getById: jest.fn(),
    updateImportance: jest.fn(),
  };

  const userChecklistProgressRepository =
    {} as unknown as UserChecklistProgressRepository;
  const checklistItemRepository = {} as unknown as ChecklistItemRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: MainQuizRepository, useValue: mainQuizRepository },
        { provide: SolvedQuizRepository, useValue: solvedQuizRepository },
        {
          provide: UserChecklistProgressRepository,
          useValue: userChecklistProgressRepository,
        },
        { provide: ChecklistItemRepository, useValue: checklistItemRepository },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('[오류] mainQuiz가 없으면 MAIN_QUIZ_NOT_FOUND를 던진다', async () => {
    mainQuizRepository.findById.mockResolvedValue(null);

    await expect(
      service.saveImportance({
        mainQuizId: 1,
        solvedQuizId: 1,
        importance: Importance.HIGH,
      }),
    ).rejects.toEqual(
      new BusinessException(ERROR_MESSAGES.MAIN_QUIZ_NOT_FOUND),
    );

    expect(mainQuizRepository.findById).toHaveBeenCalledWith(1);
    expect(solvedQuizRepository.getById).not.toHaveBeenCalled();
    expect(solvedQuizRepository.updateImportance).not.toHaveBeenCalled();
  });

  it('[오류] solvedQuiz가 없으면 SOLVED_QUIZ_NOT_FOUND를 던진다', async () => {
    mainQuizRepository.findById.mockResolvedValue({ mainQuizId: 1 });
    solvedQuizRepository.getById.mockResolvedValue(null);

    await expect(
      service.saveImportance({
        mainQuizId: 1,
        solvedQuizId: 999,
        importance: Importance.LOW,
      }),
    ).rejects.toEqual(
      new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND),
    );

    expect(mainQuizRepository.findById).toHaveBeenCalledWith(1);
    expect(solvedQuizRepository.getById).toHaveBeenCalledWith(999);
    expect(solvedQuizRepository.updateImportance).not.toHaveBeenCalled();
  });

  it('[오류] 무결성 검증: solvedQuiz.mainQuiz가 없으면 SOLVED_QUIZ_MAIN_QUIZ_MISMATCH를 던진다', async () => {
    mainQuizRepository.findById.mockResolvedValue({ mainQuizId: 1 });
    solvedQuizRepository.getById.mockResolvedValue({
      solvedQuizId: 1,
      mainQuiz: null,
    });

    await expect(
      service.saveImportance({
        mainQuizId: 1,
        solvedQuizId: 1,
        importance: Importance.NORMAL,
      }),
    ).rejects.toEqual(
      new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_MAIN_QUIZ_MISMATCH),
    );

    expect(solvedQuizRepository.updateImportance).not.toHaveBeenCalled();
  });

  it('[오류] 무결성 검증: solvedQuiz.mainQuiz.mainQuizId와 dto.mainQuizId가 다르면 SOLVED_QUIZ_MAIN_QUIZ_MISMATCH를 던진다', async () => {
    mainQuizRepository.findById.mockResolvedValue({ mainQuizId: 1 });

    // 타입이 string/number 섞여도 Number() 비교로 막는지까지 검증
    solvedQuizRepository.getById.mockResolvedValue({
      solvedQuizId: 1,
      mainQuiz: { mainQuizId: '2' },
    });

    await expect(
      service.saveImportance({
        mainQuizId: 1,
        solvedQuizId: 1,
        importance: Importance.HIGH,
      }),
    ).rejects.toEqual(
      new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_MAIN_QUIZ_MISMATCH),
    );

    expect(solvedQuizRepository.updateImportance).not.toHaveBeenCalled();
  });

  it('[오류] updateImportance 결과 affected가 1이 아니면 SOLVED_QUIZ_NOT_FOUND로 방어한다', async () => {
    mainQuizRepository.findById.mockResolvedValue({ mainQuizId: 1 });
    solvedQuizRepository.getById.mockResolvedValue({
      solvedQuizId: 1,
      mainQuiz: { mainQuizId: 1 },
    });
    solvedQuizRepository.updateImportance.mockResolvedValue({ affected: 0 });

    await expect(
      service.saveImportance({
        mainQuizId: 1,
        solvedQuizId: 1,
        importance: Importance.LOW,
      }),
    ).rejects.toEqual(
      new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND),
    );

    expect(solvedQuizRepository.updateImportance).toHaveBeenCalledWith(
      1,
      'LOW',
    );
  });

  it('[정상] 중요도 저장 성공 시 solvedQuizId/importance를 반환한다', async () => {
    mainQuizRepository.findById.mockResolvedValue({ mainQuizId: 1 });
    solvedQuizRepository.getById.mockResolvedValue({
      solvedQuizId: 10,
      mainQuiz: { mainQuizId: 1 },
    });
    solvedQuizRepository.updateImportance.mockResolvedValue({ affected: 1 });

    const result = await service.saveImportance({
      mainQuizId: 1,
      solvedQuizId: 10,
      importance: Importance.HIGH,
    });

    expect(solvedQuizRepository.updateImportance).toHaveBeenCalledWith(
      10,
      'HIGH',
    );
    expect(result).toEqual({ solvedQuizId: 10, importance: 'HIGH' });
  });
});

describe('UsersService.getComprehensionStats', () => {
  let service: UsersService;

  const mainQuizRepository = {} as unknown as MainQuizRepository;
  const userChecklistProgressRepository =
    {} as unknown as UserChecklistProgressRepository;
  const checklistItemRepository = {} as unknown as ChecklistItemRepository;

  const solvedQuizRepository = {
    getComprehensionStatistics: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: MainQuizRepository, useValue: mainQuizRepository },
        { provide: SolvedQuizRepository, useValue: solvedQuizRepository },
        {
          provide: UserChecklistProgressRepository,
          useValue: userChecklistProgressRepository,
        },
        { provide: ChecklistItemRepository, useValue: checklistItemRepository },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('[정상] 사용자 이해도 통계를 반환한다', async () => {
    const mockStats = [
      {
        category: '알고리즘',
        totalSolved: 10,
        상: 5,
        중: 3,
        하: 2,
        comprehensionScore: 3.8,
      },
    ];

    solvedQuizRepository.getComprehensionStatistics.mockResolvedValue(
      mockStats,
    );

    const result = await service.getUserSolvedQuizWithComprehension(1);

    expect(
      solvedQuizRepository.getComprehensionStatistics,
    ).toHaveBeenCalledWith(1);
    expect(result.comprehensionData).toEqual(mockStats);
  });

  it('[정상] 통계가 비어있으면 빈 배열을 반환한다', async () => {
    solvedQuizRepository.getComprehensionStatistics.mockResolvedValue([]);

    const result = await service.getUserSolvedQuizWithComprehension(1);

    expect(result.comprehensionData).toEqual([]);
  });
});

describe('UsersService.getUserSolvedQuizWithComprehension', () => {
  let service: UsersService;

  const mainQuizRepository = {} as unknown as MainQuizRepository;
  const userChecklistProgressRepository =
    {} as unknown as UserChecklistProgressRepository;
  const checklistItemRepository = {} as unknown as ChecklistItemRepository;

  const solvedQuizRepository = {
    getSolvedQuizStatistics: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: MainQuizRepository, useValue: mainQuizRepository },
        { provide: SolvedQuizRepository, useValue: solvedQuizRepository },
        {
          provide: UserChecklistProgressRepository,
          useValue: userChecklistProgressRepository,
        },
        { provide: ChecklistItemRepository, useValue: checklistItemRepository },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('[정상] 사용자가 푼 문제수에 대한 통계를 반환한다', async () => {
    const mockStats = [
      {
        category: '자료구조',
        solvedQuizAmount: 42,
        totalQuizAmount: 50,
        percentage: 84,
      },
    ];

    solvedQuizRepository.getSolvedQuizStatistics.mockResolvedValue(mockStats);

    const result = await service.getUserSolvedStatistics(1);

    expect(solvedQuizRepository.getSolvedQuizStatistics).toHaveBeenCalledWith(
      1,
    );
    expect(result.solvedData).toEqual(mockStats);
  });

  it('[정상] 통계가 비어있으면 빈 배열을 반환한다', async () => {
    solvedQuizRepository.getSolvedQuizStatistics.mockResolvedValue([]);

    const result = await service.getUserSolvedStatistics(1);

    expect(result.solvedData).toEqual([]);
  });
});
