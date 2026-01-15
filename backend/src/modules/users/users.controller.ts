import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SaveImportanceRequestDto,
  SaveSolvedQuizRequestDto,
} from './dto/users-request.dto';
import {
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
}
