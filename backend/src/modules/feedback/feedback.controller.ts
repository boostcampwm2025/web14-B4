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
  ) {
    return this.feedbackService.getAIFeedback(solvedQuizId);
  }
}
