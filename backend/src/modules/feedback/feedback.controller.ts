import { CreateAIFeedbackRequestDto } from './dto/feedback-request.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('/')
  async createAIFeedback(@Body() dto: CreateAIFeedbackRequestDto) {
    const result = this.feedbackService.generateAIFeedback(dto);
    return result;
  }
}
