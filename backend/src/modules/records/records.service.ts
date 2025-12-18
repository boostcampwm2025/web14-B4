import { Injectable } from '@nestjs/common';
import type { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';
import { allowedMimeTypes, CLOVA_STT } from './records.constants';
import { ClovaSttResponse } from './dto/ClovaSttResponse.dto';

@Injectable()
export class RecordsService {
  constructor(private configService: ConfigService) {}

  async speechToText(audioFile: Multer.File): Promise<string> {
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

  checkValidation(recordFile: Multer.File): void {
    if (!recordFile || !recordFile.buffer)
      throw new Error('유효하지 않는 녹음 파일입니다.');
    if (!allowedMimeTypes.includes(recordFile.mimetype))
      throw new Error(`지원하지 않는 녹음 파일입니다: ${recordFile.mimetype}`);
  }
}
