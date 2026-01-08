import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SaveChecklistProgressDto } from './dto/users-request.dto';

const TEST_USER_ID = 2;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('checklist-progress')
  async saveChecklistProgress(@Body() dto: SaveChecklistProgressDto) {
    // TODO 로그인 된 userId를 받아 주입하도록 함.
    return this.usersService.saveChecklistProgress(TEST_USER_ID, dto);
  }
}
