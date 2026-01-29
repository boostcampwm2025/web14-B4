import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.repository';
import { UserChecklistProgressRepository } from '../../datasources/repositories/tb-user-checklist-progress.repository';
import {
  SaveImportanceRequestDto,
  SaveSolvedQuizRequestDto,
} from './dto/users-request.dto';
import { Transactional } from 'typeorm-transactional';
import {
  GetUserComprehensionsResponseDto,
  GetUserSolvedStatisticsResponseDto,
  SaveImportanceResponseDto,
} from './dto/users-response.dto';
import { ChecklistItemRepository } from 'src/datasources/repositories/tb-checklist-item.repository';
import { UserChecklistProgress } from 'src/datasources/entities/tb-user-checklist-progress.entity';
import { ERROR_MESSAGES } from '../../common/constants/error-messages';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { BusinessException } from '../../common/exceptions/business.exception';
import { MAX_USER_ANSWER_LENGTH } from 'src/common/constants/speech.constant';
import { BadRequestException } from '@nestjs/common';

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
    const userChecklist =
      await this.checklistItemRepository.getUserChecklistItems(
        userId,
        mainQuizId,
        solvedQuizId,
      );
    if (userChecklist?.length === 0) {
      throw new NotFoundException('체크리스트 내역이 존재하지 않습니다.');
    }

    return userChecklist;
  }

  @Transactional()
  async saveSolvedQuiz(userId: number, dto: SaveSolvedQuizRequestDto) {
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

    // 나의 답변이 길이 제한을 초과할 경우 오류 반환
    if (solvedQuiz.speechText.length > MAX_USER_ANSWER_LENGTH) {
      throw new BusinessException(ERROR_MESSAGES.ANSWER_TOO_LONG);
    }

    const savedSolvedQuiz =
      await this.solvedQuizRepository.updateSolvedQuiz(solvedQuiz);

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
    userId: number,
    dto: SaveImportanceRequestDto,
  ): Promise<SaveImportanceResponseDto> {
    const { mainQuizId, solvedQuizId, importance } = dto;

    const solvedQuiz = await this.solvedQuizRepository.getById(solvedQuizId);
    if (!solvedQuiz) {
      throw new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND);
    }
    if (solvedQuiz.user.userId !== userId) {
      throw new BadRequestException(ERROR_MESSAGES.ACCESS_DENIED);
    }

    const mainQuiz = await this.mainQuizRepository.findById(mainQuizId);
    if (!mainQuiz) {
      throw new BusinessException(ERROR_MESSAGES.MAIN_QUIZ_NOT_FOUND);
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

  /* 푼 문제의 체크리스트와 사용자의 체크 여부를 조회 */
  async getUserChecklistProgress(
    solvedQuiz: number,
  ): Promise<UserChecklistProgress[]> {
    const userChecklistProgress =
      await this.userChecklistProgressRepository.getChecklistProgressBySolved(
        solvedQuiz,
      );
    if (!userChecklistProgress || userChecklistProgress?.length == 0)
      throw new NotFoundException(
        '해당 solved quiz의 체크리스트가 존재하지 않습니다.',
      );
    return userChecklistProgress;
  }

  /**
   * 푼 퀴즈에 대한 카테고리별 이해도 통계
   * @param userId 유저 아이디
   * @returns 푼 퀴즈에 대한 카테고리별 이해도 및 평균값
   */
  async getUserSolvedQuizWithComprehension(
    userId: number,
  ): Promise<GetUserComprehensionsResponseDto> {
    const solvedQuizCategoryStatistics =
      await this.solvedQuizRepository.getComprehensionStatistics(userId);
    return new GetUserComprehensionsResponseDto(solvedQuizCategoryStatistics);
  }

  async getUserSolvedStatistics(
    userId: number,
  ): Promise<GetUserSolvedStatisticsResponseDto> {
    const solvedData =
      await this.solvedQuizRepository.getSolvedQuizStatistics(userId);
    return new GetUserSolvedStatisticsResponseDto(solvedData);
  }
}
