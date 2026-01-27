import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SaveImportanceRequestDto,
  SaveSolvedQuizRequestDto,
} from './dto/users-request.dto';
import {
  GetUserComprehensionsResponseDto,
  GetUserSolvedStatisticsResponseDto,
  SaveImportanceResponseDto,
  SolvedQuizResponseDto,
} from './dto/users-response.dto';

const TEST_USER_ID = 1;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('solved-quizzes')
  async saveChecklistProgress(
    @Body() dto: SaveSolvedQuizRequestDto,
  ): Promise<SolvedQuizResponseDto> {
    // TODO 로그인 된 userId를 받아 주입하도록 함.
    const result = await this.usersService.saveSolvedQuiz(TEST_USER_ID, dto);
    return result;
  }

  @Post('importance')
  async saveImportance(
    @Body() dto: SaveImportanceRequestDto,
  ): Promise<SaveImportanceResponseDto> {
    const result = await this.usersService.saveImportance(dto);
    return result;
  }

  @Get('/solved-quizzes/importance')
  async getSolvedImportance(): Promise<QuizImportanceDataDto> {
    const result =
      await this.quizzesService.getSolvedWithImportance(TEST_USER_ID);
    return result;
  }

  @Get('/solved-quizzes/category-comprehension')
  async getSolvedComprehension(): Promise<GetUserComprehensionsResponseDto> {
    const result =
      await this.usersService.getUserSolvedQuizWithComprehension(TEST_USER_ID);
    return result;
  }

  @Get('/solved-quizzes/statistics')
  async getUserSolvedStatistics(): Promise<GetUserSolvedStatisticsResponseDto> {
    const result =
      await this.usersService.getUserSolvedStatistics(TEST_USER_ID);
    return result;
  }
}
