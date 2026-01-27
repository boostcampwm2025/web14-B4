import { CreateAIFeedbackRequestDto } from './dto/feedback-request.dto';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Public } from '../auth/decorator/public.decorator';

@Public()
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/')
  async createAIFeedback(@Body() dto: CreateAIFeedbackRequestDto) {
    const result = this.feedbackService.generateAIFeedback(dto);
    return result;
  }

  @Get('/:solvedQuizId')
  async getAIFeedbackResult(
    @Param('solvedQuizId', ParseIntPipe) solvedQuizId: number,
    // TODO: 추후에 로그인/회원가입 기능 구현 시에 로그인한 사용자 정보를 받아와 서비스로 전달
  ) {
    return this.feedbackService.getAIFeedback(solvedQuizId);
  }
}
