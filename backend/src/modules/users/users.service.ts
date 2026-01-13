import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import { UserChecklistProgressRepository } from '../../datasources/repositories/tb-user-checklist-progress.repository';
import { SaveChecklistProgressDto } from './dto/users-request.dto';
import { Transactional } from 'typeorm-transactional';
import { SaveChecklistProgressResponseDto } from './dto/users-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userChecklistProgressRepository: UserChecklistProgressRepository,
    private readonly mainQuizRepository: MainQuizRepository,
  ) {}

  @Transactional()
  async saveChecklistProgress(
    userId: number,
    dto: SaveChecklistProgressDto,
  ): Promise<SaveChecklistProgressResponseDto> {
    // TODO userId 존재 여부 체크

    // mainQuiz와 체크리스트 아이템 존재 여부 확인
    const mainQuiz = await this.mainQuizRepository.findById(dto.mainQuizId);

    if (!mainQuiz) throw new NotFoundException(`해당 퀴즈를 찾을 수 없습니다.`);

    // 현재 메인 퀴즈의 체크리스트 목록 불러오기
    // 현재 dto로 넘어온 체크리스트 목록 id와 비교하여 모두 존재하는지 확인
    const checklistItemIds = dto.checklistItems.map(
      (item) => item.checklistItemId,
    );

    if (!mainQuiz.validateAllChecklistItems(checklistItemIds)) {
      throw new NotFoundException(
        `유효하지 않는 체크리스트 내역이 존재합니다.`,
      );
    }

    // upsert 진행
    await this.userChecklistProgressRepository.upsertProgresses(
      userId,
      dto.solvedQuizId,
      dto.checklistItems,
    );

    return { savedCount: dto.checklistItems.length };
  }
}
