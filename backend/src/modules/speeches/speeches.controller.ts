import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechesService } from './speeches.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';

@Controller('speeches')
export class SpeechesController {
  constructor(private readonly recordsService: SpeechesService) {}

  @Post('stt')
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(
    @UploadedFile() recordFile: Express.Multer.File,
    @Body('mainQuizId') mainQuizId: string,
  ): Promise<SttResponseDto> {
    if (!recordFile) {
      throw new BadRequestException('요청에 음성 파일이 포함되지 않았습니다.');
    }
    if (!mainQuizId) {
      throw new BadRequestException('mainQuizId가 필요합니다.');
    }
    const mainQuizIdNumber = parseInt(mainQuizId, 10);
    if (isNaN(mainQuizIdNumber)) {
      throw new BadRequestException('mainQuizId는 숫자여야 합니다.');
    }

    const result = await this.recordsService.speechToText(
      recordFile,
      mainQuizIdNumber,
    );

    return new SttResponseDto(result.solvedQuizId, result.text);
  }
}
