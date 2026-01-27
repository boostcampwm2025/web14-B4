import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SpeechesController } from './speeches.controller';
import { SpeechesService } from './speeches.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';
import { UpdateSpeechTextRequestDto } from './dto/UpdateSpeechTextRequestDto.dto';
import { UpdateSpeechTextResponseDto } from './dto/UpdateSpeechTextResponseDto.dto';
import { GetSpeechesResponseDto } from './dto/GetSpeechesResponseDto.dto';
import { AuthService } from '../auth/auth.service';
import { Provider } from 'src/datasources/entities/tb-user.entity';
import { Request, Response } from 'express';

// 테스트용 User 목 데이터
const createMockUser = (userId: number) => ({
  userId,
  uuid: `test-uuid-${userId}`,
  username: `testuser${userId}`,
  level: '주니어',
  interestArea: '백엔드',
  provider: Provider.NAVER,
  providerId: `kakao-${userId}`,
  createdAt: new Date('2024-01-01'),
  createdBy: userId,
  updatedAt: new Date('2024-01-01'),
  updatedBy: userId,
  solvedQuizzes: [],
});

describe('SpeechesController', () => {
  let controller: SpeechesController;

  const mockSpeechesService = {
    csrSpeechToText: jest.fn(),
    updateSpeechText: jest.fn(),
    getByQuizAndUser: jest.fn(),
    getSpeechesByMainQuizId: jest.fn(),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockRequest = {} as Request;
  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeechesController],
      providers: [
        {
          provide: SpeechesService,
          useValue: mockSpeechesService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<SpeechesController>(SpeechesController);

    // 각 테스트 전에 mock을 초기화
    jest.clearAllMocks();
  });

  describe('csrSpeechToText', () => {
    const mockAudioFile: Express.Multer.File = {
      originalname: 'test.wav',
      mimetype: 'audio/wav',
      buffer: Buffer.from('test audio data'),
      size: 1024,
    } as Express.Multer.File;

    const mainQuizId: number = 1;

    it('음성 파일을 성공적으로 텍스트로 변환한다', async () => {
      const serviceResult: { solvedQuizId: number; text: string } = {
        solvedQuizId: 1,
        text: '테스트 음성 텍스트',
      };
      mockSpeechesService.csrSpeechToText.mockResolvedValue(serviceResult);

      const result: SttResponseDto = await controller.csrSpeechToText(
        createMockUser(1),
        mockRequest,
        mockResponse,
        mockAudioFile,
        mainQuizId,
      );

      expect(result).toBeInstanceOf(SttResponseDto);
      expect(result.solvedQuizId).toBe(1);
      expect(result.text).toBe('테스트 음성 텍스트');
      expect(mockSpeechesService.csrSpeechToText).toHaveBeenCalledWith(
        mockAudioFile,
        mainQuizId,
        1, // TEST_USER_ID
      );
    });

    it('음성 파일이 제공되지 않으면 BadRequestException을 던진다', async () => {
      await expect(
        controller.csrSpeechToText(
          createMockUser(1),
          mockRequest,
          mockResponse,
          undefined as unknown as Express.Multer.File,
          mainQuizId,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockSpeechesService.csrSpeechToText).not.toHaveBeenCalled();
    });

    it('음성 파일이 null이면 BadRequestException을 던진다', async () => {
      const nullFile: Express.Multer.File | null = null;

      await expect(
        controller.csrSpeechToText(
          createMockUser(1),
          mockRequest,
          mockResponse,
          nullFile!,
          mainQuizId,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(mockSpeechesService.csrSpeechToText).not.toHaveBeenCalled();
    });

    it('STT 변환 실패 시 서비스에서 발생한 에러를 던진다', async () => {
      const error: Error = new InternalServerErrorException(
        'STT conversion failed',
      );
      mockSpeechesService.csrSpeechToText.mockRejectedValue(error);

      await expect(
        controller.csrSpeechToText(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mockAudioFile,
          mainQuizId,
        ),
      ).rejects.toThrow(error);
    });

    it('다양한 오디오 파일 형식을 받을 수 있다', async () => {
      const mp3File: Express.Multer.File = {
        ...mockAudioFile,
        mimetype: 'audio/mp3',
      } as Express.Multer.File;

      const serviceResult: { solvedQuizId: number; text: string } = {
        solvedQuizId: 2,
        text: 'MP3 텍스트',
      };
      mockSpeechesService.csrSpeechToText.mockResolvedValue(serviceResult);

      const result: SttResponseDto = await controller.csrSpeechToText(
        createMockUser(1),
        mockRequest,
        mockResponse,
        mp3File,
        mainQuizId,
      );

      expect(result.solvedQuizId).toBe(2);
      expect(result.text).toBe('MP3 텍스트');
    });
  });

  describe('updateSpeechText', () => {
    const mainQuizId: number = 1;

    it('음성 텍스트를 성공적으로 수정한다', async () => {
      const updateDto: UpdateSpeechTextRequestDto = {
        solvedQuizId: 1,
        speechText: '수정된 음성 텍스트',
      };

      const serviceResult: {
        mainQuizId: number;
        solvedQuizId: number;
        speechText: string;
      } = {
        mainQuizId: 1,
        solvedQuizId: 1,
        speechText: '수정된 음성 텍스트',
      };

      mockSpeechesService.updateSpeechText.mockResolvedValue(serviceResult);

      const result: UpdateSpeechTextResponseDto =
        await controller.updateSpeechText(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mainQuizId,
          updateDto,
        );

      expect(result).toBeInstanceOf(UpdateSpeechTextResponseDto);
      expect(result.mainQuizId).toBe(1);
      expect(result.solvedQuizId).toBe(1);
      expect(result.speechText).toBe('수정된 음성 텍스트');
      expect(mockSpeechesService.updateSpeechText).toHaveBeenCalledWith(
        updateDto.solvedQuizId,
        updateDto.speechText,
      );
    });

    it('서비스 수정 실패 시 에러를 던진다', async () => {
      const updateDto: UpdateSpeechTextRequestDto = {
        solvedQuizId: 1,
        speechText: '텍스트',
      };

      const error: Error = new InternalServerErrorException('Update failed');
      mockSpeechesService.updateSpeechText.mockRejectedValue(error);

      await expect(
        controller.updateSpeechText(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mainQuizId,
          updateDto,
        ),
      ).rejects.toThrow(error);
    });
  });

  describe('getSpeechesByMainQuizId', () => {
    const mainQuizId: number = 1;

    it('특정 퀴즈의 음성 목록을 성공적으로 조회한다', async () => {
      const mockSolvedQuizzes: Array<{
        solvedQuizId: number;
        speechText: string;
        createdAt: Date;
      }> = [
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

      mockSpeechesService.getByQuizAndUser.mockResolvedValue(mockSolvedQuizzes);

      const result: GetSpeechesResponseDto =
        await controller.getSpeechesByMainQuizId(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mainQuizId,
        );

      expect(result).toBeInstanceOf(GetSpeechesResponseDto);
      expect(result.quizId).toBe(mainQuizId);
      expect(result.speeches).toHaveLength(2);
      expect(result.speeches[0].solvedQuizId).toBe(1);
      expect(result.speeches[0].speechText).toBe('첫 번째 음성');
      expect(result.speeches[1].solvedQuizId).toBe(2);
      expect(mockSpeechesService.getByQuizAndUser).toHaveBeenCalledWith(
        mainQuizId,
        1,
      );
    });

    it('문제를 푼 기록이 없으면 빈 배열을 반환한다', async () => {
      mockSpeechesService.getByQuizAndUser.mockResolvedValue([]);

      const result: GetSpeechesResponseDto =
        await controller.getSpeechesByMainQuizId(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mainQuizId,
        );

      expect(result).toBeInstanceOf(GetSpeechesResponseDto);
      expect(result.quizId).toBe(mainQuizId);
      expect(result.speeches).toHaveLength(0);
      expect(result.speeches).toEqual([]);
    });

    it('해당 문제 조회 실패 시 에러를 던진다', async () => {
      const error: Error = new InternalServerErrorException('Database error');
      mockSpeechesService.getByQuizAndUser.mockRejectedValue(error);

      await expect(
        controller.getSpeechesByMainQuizId(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mainQuizId,
        ),
      ).rejects.toThrow(error);
    });

    it('서비스에서 반환한 데이터를 SpeechItemDto(내부에 배열을 포함한)형태로 올바르게 매핑한다', async () => {
      const mockSolvedQuizzes: Array<{
        solvedQuizId: number;
        speechText: string;
        createdAt: Date;
      }> = [
        {
          solvedQuizId: 100,
          speechText: '테스트 음성',
          createdAt: new Date('2024-06-15'),
        },
      ];

      mockSpeechesService.getByQuizAndUser.mockResolvedValue(mockSolvedQuizzes);

      const result: GetSpeechesResponseDto =
        await controller.getSpeechesByMainQuizId(
          createMockUser(1),
          mockRequest,
          mockResponse,
          mainQuizId,
        );

      expect(result.speeches[0].solvedQuizId).toBe(100);
      expect(result.speeches[0].speechText).toBe('테스트 음성');
      expect(result.speeches[0].createdAt).toEqual(new Date('2024-06-15'));
    });
  });
});
