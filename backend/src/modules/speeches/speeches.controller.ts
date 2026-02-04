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
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechesService } from './speeches.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';
import { UpdateSpeechTextRequestDto } from './dto/UpdateSpeechTextRequestDto.dto';
import { UpdateSpeechTextResponseDto } from './dto/UpdateSpeechTextResponseDto.dto';
import { GetSpeechesResponseDto } from './dto/GetSpeechesResponseDto.dto';
import { SpeechItemDto } from './dto/SpeechItemDto.dto';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { CreateSpeechTextAnswerRequestDto } from './dto/CreateSpeechTextAnswerRequest.dto';
import { CreateSpeechTextAnswerResponseDto } from './dto/CreateSpeechTextAnswerResponse.dto';
import { AUDIOFILE_MAX_SIZE_BYTES } from 'src/common/constants/speech.constants';
import { Public } from '../auth/decorator/public.decorator';
import { OptionalCurrentUser } from '../auth/decorator/optional-current-user.decorator';
import { User } from 'src/datasources/entities/tb-user.entity';
import type { Request, Response } from 'express';
import { getOrCreateGuestUserId } from '../auth/utils/guest-user.util';
import { AuthService } from '../auth/auth.service';
@Public()
@Controller('speeches')
export class SpeechesController {
  constructor(
    private readonly speechesService: SpeechesService,
    private readonly authService: AuthService,
  ) {}

  @Post('stt')
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: { fileSize: AUDIOFILE_MAX_SIZE_BYTES },
    }),
  )
  async clovaLongStt(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() recordFile: Express.Multer.File,
    @Body('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<SttResponseDto> {
    if (!recordFile) {
      throw new BadRequestException(ERROR_MESSAGES.MISSING_RECORD_FILE);
    }

    const userAgent = req.headers['user-agent'];
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );

    const result = await this.speechesService.clovaSpeechLongStt(
      recordFile,
      mainQuizId,
      userId,
      {
        userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      },
    );

    return new SttResponseDto(result.solvedQuizId, result.text);
  }

  @Patch(':mainQuizId')
  async updateSpeechText(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
    @Body() updateSpeechTextRequestDto: UpdateSpeechTextRequestDto,
  ): Promise<UpdateSpeechTextResponseDto> {
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );

    const result = await this.speechesService.updateSpeechText(
      updateSpeechTextRequestDto.solvedQuizId,
      updateSpeechTextRequestDto.speechText,
      userId,
    );

    return new UpdateSpeechTextResponseDto(
      result.mainQuizId,
      result.solvedQuizId,
      result.speechText,
    );
  }

  @Get(':mainQuizId')
  async getSpeechesByMainQuizId(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<GetSpeechesResponseDto> {
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );
    const solvedQuizzes = await this.speechesService.getByQuizAndUser(
      mainQuizId,
      userId,
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
  @Post('text/:mainQuizId')
  async createSpeechText(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
    @Body() body: CreateSpeechTextAnswerRequestDto,
  ): Promise<CreateSpeechTextAnswerResponseDto> {
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );
    const result = await this.speechesService.createSpeechText({
      userId,
      mainQuizId,
      speechText: body.speechText,
    });

    return result;
  }
}
