import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { allowedMimeTypes, CLOVA_STT } from './records.constants';
import { ClovaSttResponse } from './dto/ClovaSttResponse.dto';

@Injectable()
export class RecordsService {
  constructor(private configService: ConfigService) {}

  async speechToText(audioFile: Express.Multer.File): Promise<string> {
    if (!audioFile || !audioFile.buffer) {
      throw new Error('Invalid audio file');
    }

    const audio = audioFile.buffer;
    const result = await this.sttWithClova(audio);

    return result;
  }

  private async sttWithClova(audio) {
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
      body: audio,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`클로바 STT 변환 실패: ${errorText}`);
    }

    const sttResponse = (await response.json()) as ClovaSttResponse;

    return sttResponse.text;
  }

  checkValidation(recordFile: Express.Multer.File): void {
    // 임시로 녹음 파일의 크기를 바탕으로 녹음 길이 제한 설정
    // TODO : 정확한 녹음 시간 길이를 바탕으로 제한 처리 필요
    const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
    if (recordFile.buffer.length > MAX_SIZE_BYTES)
      throw new Error('녹음 시간이 N초가 넘는 파일입니다.');
    if (!recordFile || !recordFile.buffer)
      throw new Error('유효하지 않는 녹음 파일입니다.');
    if (!allowedMimeTypes.includes(recordFile.mimetype))
      throw new Error(`지원하지 않는 녹음 파일입니다: ${recordFile.mimetype}`);
  }
}
