import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechesService } from './speeches.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';
import { UpdateSpeechTextRequestDto } from './dto/UpdateSpeechTextRequestDto.dto';
import { UpdateSpeechTextResponseDto } from './dto/UpdateSpeechTextResponseDto.dto';
import { GetSpeechesResponseDto } from './dto/GetSpeechesResponseDto.dto';
import { SpeechItemDto } from './dto/SpeechItemDto.dto';

@Controller('speeches')
export class SpeechesController {
  constructor(private readonly recordsService: SpeechesService) {}

  @Post('stt')
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(
    @UploadedFile() recordFile: Express.Multer.File,
    @Body('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<SttResponseDto> {
    if (!recordFile) {
      throw new BadRequestException('요청에 음성 파일이 포함되지 않았습니다.');
    }

    const result = await this.recordsService.speechToText(
      recordFile,
      mainQuizId,
    );

    return new SttResponseDto(result.solvedQuizId, result.text);
  }

  @Patch(':mainQuizId')
  async updateSpeechText(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
    @Body() updateSpeechTextRequestDto: UpdateSpeechTextRequestDto,
  ): Promise<UpdateSpeechTextResponseDto> {
    // TODO : mainQuizId 로 mainQuiz record조회 후 유효한지 확인

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

  @Get(':mainQuizId')
  async getSpeechesByMainQuizId(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<GetSpeechesResponseDto> {
    const solvedQuizzes =
      await this.recordsService.getByQuizAndUser(mainQuizId);

    const speechItems = solvedQuizzes.map(
      (solvedQuiz) =>
        new SpeechItemDto(
          solvedQuiz.solvedQuizId,
          solvedQuiz.speechText,
          solvedQuiz.createdAt,
        ),
    );

    return new GetSpeechesResponseDto(mainQuizId, speechItems);
  }
}
