import { CreateAIFeedbackRequestDto } from './dto/feedback-request.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Req,
  Res,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Public } from '../auth/decorator/public.decorator';
import { OptionalCurrentUser } from '../auth/decorator/optional-current-user.decorator';
import { User } from 'src/datasources/entities/tb-user.entity';
import { getOrCreateGuestUserId } from '../auth/utils/guest-user.util';
import { AuthService } from '../auth/auth.service';
import type { Request, Response } from 'express';

@Public()
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly authService: AuthService,
  ) {}

  @Post('/')
  async createAIFeedback(@Body() dto: CreateAIFeedbackRequestDto) {
    const result = this.feedbackService.generateAIFeedback(dto);
    return result;
  }

  @Get('/:solvedQuizId')
  async getAIFeedbackResult(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('solvedQuizId', ParseIntPipe) solvedQuizId: number,
  ) {
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );
    return this.feedbackService.getAIFeedback(solvedQuizId, userId);
  }

  @Get('/:solvedQuizId/speech-text')
  async getSpeechText(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('solvedQuizId', ParseIntPipe) solvedQuizId: number,
  ) {
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );
    return this.feedbackService.getSpeechText(solvedQuizId, userId);
  }
}
