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
import { ERROR_MESSAGES } from '../../common/constants/error-messages';

// TODO : 추후 쿠키를 통해 사용자를 식별할 예정. 임시값으로 USER_ID 1 을 사용
const TEST_USER_ID = 1;

@Controller('speeches')
export class SpeechesController {
  constructor(private readonly speechesService: SpeechesService) {}

  @Post('stt')
  @UseInterceptors(FileInterceptor('audio'))
  async clovaLongStt(
    @UploadedFile() recordFile: Express.Multer.File,
    @Body('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<SttResponseDto> {
    if (!recordFile) {
      throw new BadRequestException(ERROR_MESSAGES.MISSING_RECORD_FILE);
    }

    const result = await this.speechesService.clovaSpeechLongStt(
      recordFile,
      mainQuizId,
      TEST_USER_ID,
    );

    return new SttResponseDto(result.solvedQuizId, result.text);
  }

  @Post('stt-csr')
  @UseInterceptors(FileInterceptor('audio'))
  async csrSpeechToText(
    @UploadedFile() recordFile: Express.Multer.File,
    @Body('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<SttResponseDto> {
    if (!recordFile) {
      throw new BadRequestException(ERROR_MESSAGES.MISSING_RECORD_FILE);
    }

    const result = await this.speechesService.csrSpeechToText(
      recordFile,
      mainQuizId,
      TEST_USER_ID,
    );

    return new SttResponseDto(result.solvedQuizId, result.text);
  }

  @Patch(':mainQuizId')
  async updateSpeechText(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
    @Body() updateSpeechTextRequestDto: UpdateSpeechTextRequestDto,
  ): Promise<UpdateSpeechTextResponseDto> {
    // TODO : mainQuizId 로 mainQuiz record조회 후 유효한지 확인

    const result = await this.speechesService.updateSpeechText(
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
    const solvedQuizzes = await this.speechesService.getByQuizAndUser(
      mainQuizId,
      TEST_USER_ID,
    );

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
