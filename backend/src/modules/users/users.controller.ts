import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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
import { User } from 'src/datasources/entities/tb-user.entity';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { QuizImportanceDataDto } from '../quizzes/dto/quiz-importance-response.dto';
import { QuizzesService } from '../quizzes/quizzes.service';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorator/public.decorator';
import { OptionalCurrentUser } from '../auth/decorator/optional-current-user.decorator';
import { getOrCreateGuestUserId } from '../auth/utils/guest-user.util';
import type { Request, Response } from 'express';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly quizzesService: QuizzesService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('solved-quizzes')
  async saveChecklistProgress(
    @OptionalCurrentUser() user: User | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SaveSolvedQuizRequestDto,
  ): Promise<SolvedQuizResponseDto> {
    const userId = await getOrCreateGuestUserId(
      user,
      req,
      res,
      this.authService,
    );
    const result = await this.usersService.saveSolvedQuiz(userId, dto);
    return result;
  }

  @Post('importance')
  async saveImportance(
    @CurrentUser() user: User,
    @Body() dto: SaveImportanceRequestDto,
  ): Promise<SaveImportanceResponseDto> {
    const result = await this.usersService.saveImportance(user.userId, dto);
    return result;
  }

  @Get('/solved-quizzes/importance')
  async getSolvedImportance(
    @CurrentUser() user: User,
  ): Promise<QuizImportanceDataDto> {
    const result = await this.quizzesService.getSolvedWithImportance(
      user.userId,
    );
    return result;
  }

  @Get('/solved-quizzes/category-comprehension')
  async getSolvedComprehension(
    @CurrentUser() user: User,
  ): Promise<GetUserComprehensionsResponseDto> {
    const result = await this.usersService.getUserSolvedQuizWithComprehension(
      user.userId,
    );
    return result;
  }

  @Get('/solved-quizzes/statistics')
  async getUserSolvedStatistics(
    @CurrentUser() user: User,
  ): Promise<GetUserSolvedStatisticsResponseDto> {
    const result = await this.usersService.getUserSolvedStatistics(user.userId);
    return result;
  }
}
