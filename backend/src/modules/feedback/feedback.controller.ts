import { Controller, Post, Body } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('test')
  async testAiConnection() {
    const mockQuizTitle = '프로세스와 스레드의 차이를 설명하세요.';
    const mockUserAnswer =
      '프로세스는 실행 중인 프로그램이고, 스레드는 프로세스 안에서 실행되는 흐름입니다. 프로세스는 독립적이지만 스레드는 메모리를 공유합니다.';
    const result = await this.feedbackService.analyzeAnswer(
      mockQuizTitle,
      mockUserAnswer,
    );
    return result;
  }
}
