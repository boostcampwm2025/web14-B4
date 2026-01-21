import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CsrClovaSttResponse } from './dto/CsrClovaSttResponse.dto';
import { allowedMimeTypes, CLOVA_STT } from './speeches.constants';
import { SolvedQuizRepository } from '../../datasources/repositories/tb-solved-quiz.repository';
import { SttResponseDto } from './dto/SttResponseDto.dto';

type ClovaSpeechLongSyncResponse = {
  text: string; // 변환 텍스트

  // 로깅용
  result?: string; // 예: "COMPLETED"
  message?: string; // 예: "Succeeded"
  confidence?: string; // 정확도
};

// TODO : 추가로 처리해야할 예외
/* 답변 텍스트가 너무 짧은 경우, 예외 처리.
   해당 예외를 추가하지 않은 이유: 테스트 및 데모 시에 짧은 텍스트가 들어올 수 있기 때문에 해당 예외는 추후에 추가 예정.
*/
@Injectable()
export class SpeechesService {
  constructor(
    private configService: ConfigService,
    private solvedQuizRepository: SolvedQuizRepository,
  ) {}

  /**
   * 음성 녹음을 텍스트로 변환하여 반환한다.
   * @param audioFile : 음성 파일
   * @param mainQuizId : 메인 퀴즈 id
   * @param userId : 사용자 id
   * @returns : 음성 파일을 텍스트로 변환한 문자열
   */
  async csrSpeechToText(
    audioFile: Express.Multer.File,
    mainQuizId: number,
    userId: number,
  ): Promise<{ solvedQuizId: number; text: string }> {
    this.checkValidation(audioFile);

    const audio: Buffer = audioFile.buffer;
    let sttText: string;

    try {
      sttText = await this.csrSttWithClova(audio);
    } catch {
      throw new InternalServerErrorException(
        '음성 인식(STT) 처리 중 오류가 발생했습니다.',
      );
    }

    if (!sttText || sttText.trim().length === 0) {
      throw new InternalServerErrorException(
        'STT 변환 결과가 없습니다. 더 명확한 음성으로 다시 시도해주세요.',
      );
    }

    const solvedQuiz = await this.solvedQuizRepository.createSolvedQuiz({
      user: { userId: userId },
      mainQuiz: { mainQuizId: mainQuizId },
      speechText: sttText,
    });

    return {
      solvedQuizId: solvedQuiz.solvedQuizId,
      text: sttText,
    };
  }

  /**
   * 음성 텍스트를 수정한다.
   * @param solvedQuizId : 풀었던 퀴즈 id
   * @param speechText : 사용자가 수정한 녹음 텍스트
   * @returns : 저장된 녹음 텍스트 정보
   */
  async updateSpeechText(
    solvedQuizId: number,
    speechText: string,
  ): Promise<{ mainQuizId: number; solvedQuizId: number; speechText: string }> {
    if (!speechText || speechText.trim().length === 0) {
      throw new BadRequestException(
        '수정된 답변 내용이 비어있습니다. 내용을 입력해주세요.',
      );
    }

    const success = await this.solvedQuizRepository.updateSpeechText(
      solvedQuizId,
      speechText,
    );
    if (!success)
      throw new InternalServerErrorException(
        'speech Text update에 실패하였습니다.',
      );

    const updatedSolvedQuiz =
      await this.solvedQuizRepository.getById(solvedQuizId);

    if (!updatedSolvedQuiz) {
      throw new InternalServerErrorException(
        '업데이트 후 데이터를 조회할 수 없습니다.',
      );
    }

    return {
      mainQuizId: updatedSolvedQuiz.mainQuiz.mainQuizId,
      solvedQuizId: updatedSolvedQuiz.solvedQuizId,
      speechText: updatedSolvedQuiz.speechText,
    };
  }

  /**
   * 특정 퀴즈 id에 대해 사용자가 답변한 음성 텍스트들을 조회한다.
   * @param mainQuizId : 메인 퀴즈 id
   * @param userId : 사용자 id
   * @returns : 음성 텍스트 목록
   */
  async getByQuizAndUser(
    mainQuizId: number,
    userId: number,
  ): Promise<
    Array<{ solvedQuizId: number; speechText: string; createdAt: Date }>
  > {
    const solvedQuizzes = await this.solvedQuizRepository.getByQuizAndUser(
      mainQuizId,
      userId,
    );

    return solvedQuizzes.map((solvedQuiz) => ({
      solvedQuizId: solvedQuiz.solvedQuizId,
      speechText: solvedQuiz.speechText,
      createdAt: solvedQuiz.createdAt,
    }));
  }

  /**
   * 푼 퀴즈 id 정보로 사용자가 답변을 조회한다.
   * @param solvedQuizId : 푼 퀴즈 id
   * @returns : 음성 텍스트 목록
   */
  async getSolvedQuizInfo(solvedQuizId: number) {
    const solvedQuiz =
      await this.solvedQuizRepository.getSpeechTextById(solvedQuizId);

    if (!solvedQuiz) {
      throw new NotFoundException('존재하지 않는 퀴즈 입니다.');
    }

    return solvedQuiz;
  }

  /* 음성 buffer를 clova STT를 사용하여 텍스트로 변환 */
  private async csrSttWithClova(audio: Buffer) {
    const clientId = this.configService.get<string>('NAVER_CLOVA_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'NAVER_CLOVA_CLIENT_SECRET',
    );
    const url = `${CLOVA_STT.BASE_URL}?lang=${CLOVA_STT.DEFAULT_LANG}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-ncp-apigw-api-key-id': clientId || '',
        'x-ncp-apigw-api-key': clientSecret || '',
      },
      body: audio as unknown as BodyInit,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new InternalServerErrorException(
        `클로바 STT 변환 실패: ${errorText}`,
      );
    }

    const sttResponse = (await response.json()) as CsrClovaSttResponse;

    return sttResponse.text;
  }

  /* 녹음 파일의 유효성 검사 */
  private checkValidation(recordFile: Express.Multer.File): void {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

    if (!recordFile || !recordFile.buffer)
      throw new BadRequestException('유효하지 않는 녹음 파일입니다.');

    if (!allowedMimeTypes.includes(recordFile.mimetype))
      throw new UnsupportedMediaTypeException(
        `지원하지 않는 녹음 파일입니다: ${recordFile.mimetype}`,
      );

    if (recordFile.buffer.length > MAX_SIZE_BYTES) {
      throw new PayloadTooLargeException(
        '변환하기에 너무 큰 녹음 용량 파일입니다. 3분 내로 녹음해주세요.',
      );
    }
  }

  // CLOVA speech long sync 추가
  async clovaSpeechLongStt(
    audioFile: Express.Multer.File,
    mainQuizId: number,
    userId: number,
  ): Promise<SttResponseDto> {
    this.checkValidation(audioFile);

    const { url, secretKey, language } = this.getClovaSpeechLongConfig();
    const formData = this.buildFormData(audioFile, language);

    const result = await this.fetchClovaSpeechLong(url, secretKey, formData);

    const sttText = typeof result.text === 'string' ? result.text.trim() : '';
    if (sttText.length === 0) {
      throw new InternalServerErrorException(
        'STT 변환 결과가 없습니다. 더 명확한 음성으로 다시 시도해주세요.',
      );
    }

    const solvedQuiz = await this.solvedQuizRepository.createSolvedQuiz({
      user: { userId },
      mainQuiz: { mainQuizId },
      speechText: sttText,
    });

    return {
      solvedQuizId: solvedQuiz.solvedQuizId,
      text: sttText,
    };
  }

  private getClovaSpeechLongConfig(): {
    url: string;
    secretKey: string;
    language: string;
  } {
    const invokeUrl = this.configService.get<string>(
      'NAVER_CLOVA_SPEECH_INVOKE_URL',
    );
    const secretKey = this.configService.get<string>(
      'NAVER_CLOVA_SPEECH_SECRET_KEY',
    );
    const language =
      this.configService.get<string>('NAVER_CLOVA_SPEECH_DEFAULT_LANG') ??
      'ko-KR';

    if (!invokeUrl || !secretKey) {
      throw new InternalServerErrorException(
        'CLOVA Speech 환경변수가 설정되지 않았습니다.',
      );
    }

    const url = `${invokeUrl}/recognizer/upload`;
    return { url, secretKey, language };
  }

  private buildFormData(
    audioFile: Express.Multer.File,
    language: string,
  ): FormData {
    const params = {
      language, // 'ko-KR'
      completion: 'sync', // sync로 바로 결과 받기
      fullText: true, // 전체 텍스트 반환
      wordAlignment: false, // 인식 결과의 음성과 텍스트 정렬 출력 여부
      noiseFiltering: true, // 잡음 제거
      diarization: { enable: false }, // 화자 인식 비활성화
    } as const;

    const form = new FormData();

    const blob = new Blob([new Uint8Array(audioFile.buffer)], {
      type: audioFile.mimetype || 'audio/webm',
    });
    form.append('media', blob, audioFile.originalname || 'audio.webm');
    form.append('params', JSON.stringify(params));

    return form;
  }

  private async fetchClovaSpeechLong(
    url: string,
    secretKey: string,
    formData: FormData,
  ): Promise<ClovaSpeechLongSyncResponse> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-CLOVASPEECH-API-KEY': secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BadGatewayException(`CLOVA STT 변환 실패: ${errorText}`);
    }

    const result = (await response.json()) as ClovaSpeechLongSyncResponse;
    return result;
  }
}
