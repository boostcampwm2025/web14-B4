import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SaveChecklistProgressDto,
  SaveImportanceRequestDto,
} from './dto/users-request.dto';
import {
  SaveChecklistProgressResponseDto,
  SaveImportanceResponseDto,
} from './dto/users-response.dto';

const TEST_USER_ID = 1;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('checklist-progress')
  async saveChecklistProgress(
    @Body() dto: SaveChecklistProgressDto,
  ): Promise<SaveChecklistProgressResponseDto> {
    // TODO 로그인 된 userId를 받아 주입하도록 함.
    return await this.usersService.saveChecklistProgress(TEST_USER_ID, dto);
  }

  @Post('importance')
  async saveImportance(
    @Body() dto: SaveImportanceRequestDto,
  ): Promise<SaveImportanceResponseDto> {
    const result = await this.usersService.saveImportance(dto);
    return result;
  }
}
