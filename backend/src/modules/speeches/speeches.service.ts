import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClovaSttResponse } from './dto/ClovaSttResponse.dto';
import { allowedMimeTypes, CLOVA_STT } from './speeches.constants';
import { SolvedQuizRepository } from '../../datasources/repositories/solved-quiz.repository';

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
  async speechToText(
    audioFile: Express.Multer.File,
    mainQuizId: number,
    userId: number,
  ): Promise<{ solvedQuizId: number; text: string }> {
    this.checkValidation(audioFile);

    const audio: Buffer = audioFile.buffer;
    let sttText: string;

    try {
      sttText = await this.sttWithClova(audio);
    } catch {
      throw new Error('음성 인식(STT) 처리 중 오류가 발생했습니다.');
    }

    const solvedQuiz = await this.solvedQuizRepository.createSolvedQuiz(
      userId,
      mainQuizId,
      sttText,
    );

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
    const updatedSolvedQuiz = await this.solvedQuizRepository.updateSpeechText(
      solvedQuizId,
      speechText,
    );

    return {
      mainQuizId: updatedSolvedQuiz.mainQuizId,
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
    const solvedQuizzes = await this.solvedQuizRepository.findByQuizAndUser(
      mainQuizId,
      userId,
    );

    return solvedQuizzes.map((solvedQuiz) => ({
      solvedQuizId: solvedQuiz.solvedQuizId,
      speechText: solvedQuiz.speechText,
      createdAt: solvedQuiz.createdAt,
    }));
  }

  /* 음성 buffer를 clova STT를 사용하여 텍스트로 변환 */
  private async sttWithClova(audio: Buffer) {
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
      throw new Error(`클로바 STT 변환 실패: ${errorText}`);
    }

    const sttResponse = (await response.json()) as ClovaSttResponse;

    return sttResponse.text;
  }

  /* 녹음 파일의 유효성 검사 */
  private checkValidation(recordFile: Express.Multer.File): void {
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

    if (!recordFile || !recordFile.buffer)
      throw new Error('유효하지 않는 녹음 파일입니다.');

    if (!allowedMimeTypes.includes(recordFile.mimetype))
      throw new Error(`지원하지 않는 녹음 파일입니다: ${recordFile.mimetype}`);

    if (recordFile.buffer.length > MAX_SIZE_BYTES) {
      throw new Error('녹음 용량 파일이 너무 큽니다.');
    }
  }
}
