import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import SaveSolvedQuizRequestDto from './dto/users-request.dto';
import { SolvedQuizResponseDto } from './dto/users-response.dto';

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
}
