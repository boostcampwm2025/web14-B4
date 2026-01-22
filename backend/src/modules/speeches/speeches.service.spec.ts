import { Test, TestingModule } from '@nestjs/testing';
import { SpeechesService } from './speeches.service';
import { ConfigService } from '@nestjs/config';
import { SolvedQuizRepository } from '../../datasources/repositories/tb-solved-quiz.repository';
import { CsrClovaSttResponse } from './dto/CsrClovaSttResponse.dto';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { InternalServerErrorException } from '@nestjs/common';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonLogger,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

type SolvedQuizEntity = {
  solvedQuizId: number;
  speechText: string;
  createdAt: Date;
};

type CsrSpeechToTextResult = {
  solvedQuizId: number;
  text: string;
};

type UpdateSpeechTextResult = {
  mainQuizId: number;
  solvedQuizId: number;
  speechText: string;
};

type SttResponseDto = {
  solvedQuizId: number;
  text: string;
};

type ClovaSpeechLongSyncResponse = {
  result?: string;
  message?: string;
  confidence?: string;
  text?: string;
};

const mockLogger: Partial<WinstonLogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const setFetchMock = (mock: jest.MockedFunction<typeof fetch>) => {
  const g = globalThis as unknown as { fetch: typeof fetch };
  g.fetch = mock;
};

const clearFetchMock = () => {
  const g = globalThis as unknown as { fetch?: typeof fetch };
  delete g.fetch;
};

describe('SpeechesService', () => {
  let service: SpeechesService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockSolvedQuizRepository = {
    createSolvedQuiz: jest.fn(),
    updateSpeechText: jest.fn(),
    getByQuizAndUser: jest.fn(),
    getById: jest.fn(),
  };

  const mockAudioFile: Express.Multer.File = {
    originalname: 'test.webm',
    mimetype: 'audio/webm',
    buffer: Buffer.from('test audio data'),
    size: 1024,
    encoding: '7bit',
    destination: '/uploads',
    filename: 'audio.webm',
    path: '/uploads/audio.webm',
    fieldname: 'audio',
  } as Express.Multer.File;

  const mainQuizId: number = 1;
  const userId: number = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console({
              silent: true,
            }),
          ],
        }),
      ],
      providers: [
        SpeechesService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SolvedQuizRepository,
          useValue: mockSolvedQuizRepository,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<SpeechesService>(SpeechesService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    clearFetchMock();
  });

  const setValidClovaEnv = () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'NAVER_CLOVA_SPEECH_INVOKE_URL') return 'https://clova.test';
      if (key === 'NAVER_CLOVA_SPEECH_SECRET_KEY') return 'secret-key';
      if (key === 'NAVER_CLOVA_SPEECH_DEFAULT_LANG') return 'ko-KR';
      return undefined;
    });
  };

  describe('csrSpeechToText', () => {
    it('유효한 음성 파일을 텍스트로 변환하고 저장한다', async () => {
      const clovaResponse: CsrClovaSttResponse = {
        text: '변환된 음성 텍스트',
      } as CsrClovaSttResponse;

      const mockSolvedQuiz: SolvedQuizEntity = {
        solvedQuizId: 1,
        speechText: '변환된 음성 텍스트',
        createdAt: new Date(),
      };

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(clovaResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      mockConfigService.get.mockReturnValue('test-key');
      mockSolvedQuizRepository.createSolvedQuiz.mockResolvedValue(
        mockSolvedQuiz,
      );

      const result: CsrSpeechToTextResult = await service.csrSpeechToText(
        mockAudioFile,
        mainQuizId,
        userId,
      );

      expect(result.solvedQuizId).toBe(1);
      expect(result.text).toBe('변환된 음성 텍스트');
    });

    it('지원하지 않는 MIME 타입이면 에러를 던진다', async () => {
      const invalidFile: Express.Multer.File = {
        ...mockAudioFile,
        mimetype: 'video/mp4',
      } as Express.Multer.File;

      await expect(
        service.csrSpeechToText(invalidFile, mainQuizId, userId),
      ).rejects.toThrow('지원하지 않는 녹음 파일입니다: video/mp4');
    });

    it('5MB 이상의 파일이면 에러를 던진다', async () => {
      const largeFile: Express.Multer.File = {
        ...mockAudioFile,
        buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
        size: 5 * 1024 * 1024 + 1,
      } as Express.Multer.File;

      await expect(
        service.csrSpeechToText(largeFile, mainQuizId, userId),
      ).rejects.toThrow(
        '변환하기에 너무 큰 녹음 용량 파일입니다. 3분 내로 녹음해주세요.',
      );
    });

    it('음성 파일이 없으면 에러를 던진다', async () => {
      const noBufferFile: Partial<Express.Multer.File> = {
        ...mockAudioFile,
        buffer: undefined,
      };

      await expect(
        service.csrSpeechToText(
          noBufferFile as Express.Multer.File,
          mainQuizId,
          userId,
        ),
      ).rejects.toThrow('유효하지 않는 녹음 파일입니다.');
    });

    it('CLOVA STT API 호출 실패 시 에러를 던진다', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('API Error'),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      mockConfigService.get.mockReturnValue('test-key');

      await expect(
        service.csrSpeechToText(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow('음성 인식(STT) 처리 중 오류가 발생했습니다.');
    });

    it('STT 변환 결과가 없으면 에러를 던진다', async () => {
      const clovaResponse: CsrClovaSttResponse = {
        text: '',
      } as CsrClovaSttResponse;

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(clovaResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      mockConfigService.get.mockReturnValue('test-key');

      await expect(
        service.csrSpeechToText(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(
        'STT 변환 결과가 없습니다. 더 명확한 음성으로 다시 시도해주세요.',
      );
    });

    it('STT 변환 결과가 공백만 있으면 에러를 던진다', async () => {
      const clovaResponse: CsrClovaSttResponse = {
        text: '   ',
      } as CsrClovaSttResponse;

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(clovaResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      mockConfigService.get.mockReturnValue('test-key');

      await expect(
        service.csrSpeechToText(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(
        'STT 변환 결과가 없습니다. 더 명확한 음성으로 다시 시도해주세요.',
      );
    });
  });

  describe('updateSpeechText', () => {
    const solvedQuizId: number = 1;
    const speechText: string = '수정된 음성 텍스트';

    it('음성 텍스트를 성공적으로 수정한다', async () => {
      // getById는 엔티티 형태를 반환하므로 mainQuiz가 중첩되어야 한다
      const mockUpdatedSolvedQuiz = {
        mainQuiz: { mainQuizId: 1 },
        solvedQuizId: 1,
        speechText: '수정된 음성 텍스트',
      };

      mockSolvedQuizRepository.updateSpeechText.mockResolvedValue({
        affected: 1,
      });
      mockSolvedQuizRepository.getById.mockResolvedValue(mockUpdatedSolvedQuiz);

      const result: UpdateSpeechTextResult = await service.updateSpeechText(
        solvedQuizId,
        speechText,
      );

      expect(result.mainQuizId).toBe(1);
      expect(result.solvedQuizId).toBe(1);
      expect(result.speechText).toBe('수정된 음성 텍스트');
    });

    it('수정된 답변이 빈 문자열이면 에러를 던진다', async () => {
      await expect(service.updateSpeechText(solvedQuizId, '')).rejects.toThrow(
        '수정된 답변 내용이 비어있습니다. 내용을 입력해주세요.',
      );
    });

    it('수정된 답변이 공백만 있으면 에러를 던진다', async () => {
      await expect(
        service.updateSpeechText(solvedQuizId, '   '),
      ).rejects.toThrow(
        '수정된 답변 내용이 비어있습니다. 내용을 입력해주세요.',
      );
    });
  });

  describe('getByQuizAndUser', () => {
    it('특정 퀴즈의 사용자 음성 목록을 조회한다', async () => {
      const mockSolvedQuizzes: SolvedQuizEntity[] = [
        {
          solvedQuizId: 1,
          speechText: '첫 번째 음성',
          createdAt: new Date('2024-01-01'),
        },
        {
          solvedQuizId: 2,
          speechText: '두 번째 음성',
          createdAt: new Date('2024-01-02'),
        },
      ];

      mockSolvedQuizRepository.getByQuizAndUser.mockResolvedValue(
        mockSolvedQuizzes,
      );

      const result = await service.getByQuizAndUser(mainQuizId, userId);

      expect(result).toHaveLength(2);
      expect(result[0].solvedQuizId).toBe(1);
    });

    it('음성 기록이 없으면 빈 배열을 반환한다', async () => {
      mockSolvedQuizRepository.getByQuizAndUser.mockResolvedValue([]);

      const result = await service.getByQuizAndUser(mainQuizId, userId);

      expect(result).toEqual([]);
    });
  });

  describe('clovaSpeechLongStt', () => {
    it('정상 응답이면 변환된 텍스트를 반환하고 저장한다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          result: 'COMPLETED',
          message: 'Succeeded',
          confidence: '0.9',
          text: '  변환된 음성 텍스트  ',
        } as ClovaSpeechLongSyncResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      const mockSolvedQuiz: SolvedQuizEntity = {
        solvedQuizId: 10,
        speechText: '변환된 음성 텍스트',
        createdAt: new Date(),
      };

      mockSolvedQuizRepository.createSolvedQuiz.mockResolvedValue(
        mockSolvedQuiz,
      );

      const result: SttResponseDto = await service.clovaSpeechLongStt(
        mockAudioFile,
        mainQuizId,
        userId,
      );

      expect(result).toEqual({
        solvedQuizId: 10,
        text: '변환된 음성 텍스트',
      });

      expect(mockSolvedQuizRepository.createSolvedQuiz).toHaveBeenCalledWith({
        user: { userId },
        mainQuiz: { mainQuizId },
        speechText: '변환된 음성 텍스트',
      });
    });

    it('STT 결과가 빈 문자열/공백이면 InternalServerErrorException을 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          result: 'COMPLETED',
          message: 'Succeeded',
          text: '   ',
        } as ClovaSpeechLongSyncResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'STT 변환 결과가 없습니다. 더 명확한 음성으로 다시 시도해주세요.',
        ),
      );
    });

    it('환경변수(invokeUrl/secretKey) 누락이면 InternalServerErrorException을 던진다', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'CLOVA Speech 환경변수가 설정되지 않았습니다.',
        ),
      );
    });

    it('지원하지 않는 MIME 타입이면 에러를 던진다', async () => {
      setValidClovaEnv();

      const invalidFile: Express.Multer.File = {
        ...mockAudioFile,
        mimetype: 'video/mp4',
      } as Express.Multer.File;

      await expect(
        service.clovaSpeechLongStt(invalidFile, mainQuizId, userId),
      ).rejects.toThrow('지원하지 않는 녹음 파일입니다: video/mp4');
    });

    it('5MB 이상의 파일이면 에러를 던진다', async () => {
      setValidClovaEnv();

      const largeFile: Express.Multer.File = {
        ...mockAudioFile,
        buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
        size: 5 * 1024 * 1024 + 1,
      } as Express.Multer.File;

      await expect(
        service.clovaSpeechLongStt(largeFile, mainQuizId, userId),
      ).rejects.toThrow(
        '변환하기에 너무 큰 녹음 용량 파일입니다. 3분 내로 녹음해주세요.',
      );
    });

    it('음성 파일 buffer가 없으면 에러를 던진다', async () => {
      setValidClovaEnv();

      const noBufferFile: Partial<Express.Multer.File> = {
        ...mockAudioFile,
        buffer: undefined,
      };

      await expect(
        service.clovaSpeechLongStt(
          noBufferFile as Express.Multer.File,
          mainQuizId,
          userId,
        ),
      ).rejects.toThrow('유효하지 않는 녹음 파일입니다.');
    });

    it('response.ok=false + 401이면 EXTERNAL_API_UNAUTHORIZED를 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: jest.fn().mockResolvedValue('Authentication Failed'),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(BusinessException);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(ERROR_MESSAGES.EXTERNAL_API_UNAUTHORIZED.message);
    });

    it('response.ok=false + 404이면 EXTERNAL_API_FORBIDDEN을 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: jest.fn().mockResolvedValue('Not Found Exception'),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(ERROR_MESSAGES.EXTERNAL_API_FORBIDDEN.message);
    });

    it('response.ok=false + 429이면 EXTERNAL_API_RATE_LIMIT_EXCEEDED를 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        status: 429,
        text: jest.fn().mockResolvedValue('Rate limit exceeded'),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(
        ERROR_MESSAGES.EXTERNAL_API_RATE_LIMIT_EXCEEDED.message,
      );
    });

    it('response.ok=false + 기타 상태코드면 EXTERNAL_API_SERVER_ERROR를 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValue('Internal Error'),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(ERROR_MESSAGES.EXTERNAL_API_SERVER_ERROR.message);
    });

    it('response.ok=true + result=FAILED + message에 "일별 한도" 포함이면 EXTERNAL_API_DAILY_QUOTA_EXCEEDED를 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          result: 'FAILED',
          message: '일별 한도 초과로 실패했습니다.',
          text: '',
        } as ClovaSpeechLongSyncResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(
        ERROR_MESSAGES.EXTERNAL_API_DAILY_QUOTA_EXCEEDED.message,
      );
    });

    it('response.ok=true + result=FAILED + 기타 메시지면 EXTERNAL_API_SERVER_ERROR를 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          result: 'FAILED',
          message: 'Some other failure',
          text: '',
        } as ClovaSpeechLongSyncResponse),
      } as unknown as Response) as jest.MockedFunction<typeof fetch>;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(ERROR_MESSAGES.EXTERNAL_API_SERVER_ERROR.message);
    });

    it('네트워크 에러/타임아웃 등 fetch 자체 실패면 EXTERNAL_API_SERVER_ERROR를 던진다', async () => {
      setValidClovaEnv();

      const fetchMock = jest
        .fn()
        .mockRejectedValue(new Error('Network Error')) as jest.MockedFunction<
        typeof fetch
      >;
      setFetchMock(fetchMock);

      await expect(
        service.clovaSpeechLongStt(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow(ERROR_MESSAGES.EXTERNAL_API_SERVER_ERROR.message);
    });
  });
});
