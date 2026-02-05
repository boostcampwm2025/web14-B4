import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { MultipleChoicesResponseDto } from './dto/quiz-response.dto';
import { Public } from '../auth/decorator/public.decorator';
import { QuizFilterDto, QuizInfiniteScrollDto } from './dto/quiz-search.dto';
import { QuizCategory } from 'src/datasources/entities/tb-quiz-category.entity';

@Public()
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  @Get()
  async getAllQuizzes(@Query() searchDto: QuizInfiniteScrollDto) {
    const result = await this.quizService.getQuizzes(searchDto);
    return result;
  }

  /**
   * 카테고리별 퀴즈 갯수
   * @param filter 난이도
   * @returns 카테고리 + 갯수 리스트
   */
  @Get('aggregations')
  async getAggregations(@Query() filter: QuizFilterDto) {
    const result = await this.quizService.getAggregations(filter);
    return result;
  }

  /**
   * 전체 퀴즈 카테고리 조회
   * @returns 전체 카테고리 목록(id, name)
   */
  @Get('categories')
  getCategories(): Promise<QuizCategory[]> {
    const result = this.quizService.getQuizCategories();
    return result;
  }

  @Get(':mainQuizId/checklist')
  async getQuizChecklist(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
  ) {
    const result = await this.quizService.getQuizChecklist(mainQuizId);
    return result;
  }

  @Get(':id')
  async getQuiz(@Param('id', ParseIntPipe) id: number) {
    const result = await this.quizService.findOne(id);

    if (!result) {
      throw new NotFoundException('퀴즈를 찾을 수 없습니다.');
    }

    return result;
  }

  @Get(':mainQuizId/multiple-choices')
  async getMultipleChoices(
    @Param('mainQuizId', ParseIntPipe) mainQuizId: number,
  ): Promise<MultipleChoicesResponseDto> {
    const result =
      await this.quizService.getMultipleChoicesByMainQuizId(mainQuizId);
    return result;
  }
}
