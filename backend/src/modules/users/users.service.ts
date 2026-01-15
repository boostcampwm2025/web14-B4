import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import { UserChecklistProgressRepository } from '../../datasources/repositories/tb-user-checklist-progress.repository';
import {
  SaveChecklistProgressDto,
  SaveImportanceRequestDto,
  SaveSolvedQuizRequestDto
} from './dto/users-request.dto';
import { Transactional } from 'typeorm-transactional';
import {
  SaveChecklistProgressResponseDto,
  SaveImportanceResponseDto,
} from './dto/users-response.dto';
import { ChecklistItemRepository } from 'src/datasources/repositories/tb-checklist-item.repository';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { BusinessException } from '../../common/exceptions/business.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly userChecklistProgressRepository: UserChecklistProgressRepository,
    private readonly mainQuizRepository: MainQuizRepository,
    private readonly checklistItemRepository: ChecklistItemRepository,
    private readonly solvedQuizRepository: SolvedQuizRepository,
  ) {}

  /**
   * 유저가 체크한 체크리스트 목록 불러오기
   * @param userId 유저 아이디
   * @param mainQuizId
   * @param solvedQuizId
   */
  async getUserChecklistItems(
    userId: number,
    mainQuizId: number,
    solvedQuizId: number,
  ) {
    // TODO userId 존재 여부 체크

    const userChecklist =
      await this.checklistItemRepository.getUserChecklistItems(
        userId,
        mainQuizId,
        solvedQuizId,
      );
    if (userChecklist.length === 0) {
      throw new NotFoundException('체크리스트 내역이 존재하지 않습니다.');
    }

    return userChecklist;
  }

  @Transactional()
  async saveSolvedQuiz(userId: number, dto: SaveSolvedQuizRequestDto) {
    // TODO userId 존재 여부 체크

    // mainQuiz와 체크리스트 아이템 존재 여부 확인
    const mainQuiz = await this.mainQuizRepository.findById(dto.mainQuizId);

    if (!mainQuiz) throw new NotFoundException(`해당 퀴즈를 찾을 수 없습니다.`);

    const solvedQuiz = await this.solvedQuizRepository.getById(
      dto.solvedQuizId,
    );
    if (!solvedQuiz)
      throw new NotFoundException(
        `현재 풀고 있는 퀴즈 정보를 찾을 수 없습니다.`,
      );

    // 나의 답변 및 이해도 저장
    solvedQuiz.speechText = dto.speechText;
    solvedQuiz.comprehensionLevel = dto.comprehensionLevel;

    const savedSolvedQuiz =
      await this.solvedQuizRepository.createSolvedQuiz(solvedQuiz);

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

    await this.userChecklistProgressRepository.saveUserChecklistProgress(
      userId,
      dto.solvedQuizId,
      dto.checklistItems,
    );

    return {
      mainQuizId: savedSolvedQuiz.mainQuiz.mainQuizId,
      solvedQuizId: savedSolvedQuiz.solvedQuizId,
    };
  }

  async saveImportance(
    dto: SaveImportanceRequestDto,
  ): Promise<SaveImportanceResponseDto> {
    const { mainQuizId, solvedQuizId, importance } = dto;

    const mainQuiz = await this.mainQuizRepository.findById(mainQuizId);
    if (!mainQuiz) {
      throw new BusinessException(ERROR_MESSAGES.MAIN_QUIZ_NOT_FOUND);
    }

    const solvedQuiz = await this.solvedQuizRepository.getById(solvedQuizId);
    if (!solvedQuiz) {
      throw new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND);
    }

    // 무결성 검증
    if (
      !solvedQuiz.mainQuiz ||
      Number(solvedQuiz.mainQuiz.mainQuizId) !== Number(mainQuizId)
    ) {
      throw new BusinessException(
        ERROR_MESSAGES.SOLVED_QUIZ_MAIN_QUIZ_MISMATCH,
      );
    }

    const result = await this.solvedQuizRepository.updateImportance(
      solvedQuizId,
      importance,
    );

    // 처리 중 삭제 등으로 인해 실제로 업데이트된 행이 없는 경우 방어
    if (result.affected !== 1) {
      throw new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND);
    }

    return new SaveImportanceResponseDto({ solvedQuizId, importance });
  }
}
