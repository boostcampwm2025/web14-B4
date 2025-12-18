import { Injectable } from '@nestjs/common';
import type { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';
import { allowedMimeTypes } from './records.constants';

@Injectable()
export class RecordsService {
  constructor(private configService: ConfigService) {}

  async convertStt(file: Multer.File): Promise<string> {
    const clientId = this.configService.get<string>('NAVER_CLOVA_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'NAVER_CLOVA_CLIENT_SECRET',
    );

    if (!file || !file.buffer) {
      throw new Error('Invalid audio file');
    }

    const BASE_URL = 'https://naveropenapi.apigw.ntruss.com/recog/v1/stt';
    const url = `${BASE_URL}?lang=Kor`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-ncp-apigw-api-key-id': clientId || '',
        'x-ncp-apigw-api-key': clientSecret || '',
      },
      body: file.buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`클로바 STT 변환 실패: ${errorText}`);
    }

    const result = await response.json();

    return result.text;
  }

  checkValidation(recordFile: Multer.File): void {
    if (!recordFile) throw new Error('파일이 전송되지 않았습니다');
    if (!allowedMimeTypes.includes(recordFile.mimetype))
      throw new Error(`지원하지 않는 녹음 파일입니다: ${recordFile.mimetype}`);
  }
}
