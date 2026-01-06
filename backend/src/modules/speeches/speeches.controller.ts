import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Param,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechesService } from './speeches.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';
import { UpdateSpeechTextRequestDto } from './dto/UpdateSpeechTextRequestDto.dto';
import { UpdateSpeechTextResponseDto } from './dto/UpdateSpeechTextResponseDto.dto';

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

  @Patch(':mainQuizId')
  async updateSpeechText(
    @Param('mainQuizId') mainQuizId: string,
    @Body() updateSpeechTextRequestDto: UpdateSpeechTextRequestDto,
  ): Promise<UpdateSpeechTextResponseDto> {
    if (!mainQuizId) {
      throw new BadRequestException('mainQuizId가 필요합니다.');
    }
    // TODO : mainQuizId 로 mainQuiz record조회 후 유효한지 확인

    if (!updateSpeechTextRequestDto.solvedQuizId) {
      throw new BadRequestException('solvedQuizId가 필요합니다.');
    }

    if (!updateSpeechTextRequestDto.speechText) {
      throw new BadRequestException('speechText가 필요합니다.');
    }

    const result = await this.recordsService.updateSpeechText(
      updateSpeechTextRequestDto.solvedQuizId,
      updateSpeechTextRequestDto.speechText,
    );

    return new UpdateSpeechTextResponseDto(
      result.mainQuizId,
      result.solvedQuizId,
      result.speechText,
    );
  }
}
