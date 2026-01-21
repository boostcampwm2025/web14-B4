import { Test, TestingModule } from '@nestjs/testing';
import { SpeechesService } from './speeches.service';
import { ConfigService } from '@nestjs/config';
import { SolvedQuizRepository } from '../../datasources/repositories/tb-solved-quiz.repository';
import { CsrClovaSttResponse } from './dto/CsrClovaSttResponse.dto';

type SolvedQuizEntity = {
  solvedQuizId: number;
  speechText: string;
  createdAt: Date;
};

type csrSpeechToTextResult = {
  solvedQuizId: number;
  text: string;
};

type UpdateSpeechTextResult = {
  mainQuizId: number;
  solvedQuizId: number;
  speechText: string;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<SpeechesService>(SpeechesService);
    jest.clearAllMocks();
  });

  describe('csrSpeechToText', () => {
    const mockAudioFile: Express.Multer.File = {
      originalname: 'test.wav',
      mimetype: 'audio/wav',
      buffer: Buffer.from('test audio data'),
      size: 1024,
      encoding: '7bit',
      destination: '/uploads',
      filename: 'test.wav',
      path: '/uploads/test.wav',
      fieldname: 'audio',
    } as Express.Multer.File;

    const mainQuizId: number = 1;
    const userId: number = 1;

    it('유효한 음성 파일을 텍스트로 변환하고 저장한다', async () => {
      const clovaResponse: CsrClovaSttResponse = {
        text: '변환된 음성 텍스트',
      } as CsrClovaSttResponse;
      const mockSolvedQuiz: SolvedQuizEntity = {
        solvedQuizId: 1,
        speechText: '변환된 음성 텍스트',
        createdAt: new Date(),
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(clovaResponse),
      });

      mockConfigService.get.mockReturnValue('test-key');
      mockSolvedQuizRepository.createSolvedQuiz.mockResolvedValue(
        mockSolvedQuiz,
      );

      const result: csrSpeechToTextResult = await service.csrSpeechToText(
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
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        text: jest.fn().mockResolvedValue('API Error'),
      });

      mockConfigService.get.mockReturnValue('test-key');

      await expect(
        service.csrSpeechToText(mockAudioFile, mainQuizId, userId),
      ).rejects.toThrow('음성 인식(STT) 처리 중 오류가 발생했습니다.');
    });

    it('STT 변환 결과가 없으면 에러를 던진다', async () => {
      const clovaResponse: CsrClovaSttResponse = {
        text: '',
      } as CsrClovaSttResponse;

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(clovaResponse),
      });

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

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(clovaResponse),
      });

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
    const mainQuizId: number = 1;
    const userId: number = 1;

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

      const result: Array<{
        solvedQuizId: number;
        speechText: string;
        createdAt: Date;
      }> = await service.getByQuizAndUser(mainQuizId, userId);

      expect(result).toHaveLength(2);
      expect(result[0].solvedQuizId).toBe(1);
    });

    it('음성 기록이 없으면 빈 배열을 반환한다', async () => {
      mockSolvedQuizRepository.getByQuizAndUser.mockResolvedValue([]);

      const result: Array<{
        solvedQuizId: number;
        speechText: string;
        createdAt: Date;
      }> = await service.getByQuizAndUser(mainQuizId, userId);

      expect(result).toEqual([]);
    });
  });
});
