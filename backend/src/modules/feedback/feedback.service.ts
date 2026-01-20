import { UsersService } from './../users/users.service';
import { MainQuizRepository } from 'src/datasources/repositories/tb-main-quiz.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateAIFeedbackRequestDto } from './dto/feedback-request.dto';
import { MainQuiz } from 'src/datasources/entities/tb-main-quiz.entity';
import { SpeechesService } from '../speeches/speeches.service';
import {
  AI_FEEDBACK_SYSTEM_PROMPT,
  RESPONSE_SCHEMA,
} from './constants/ai-constant';
import { QuizKeyword } from 'src/datasources/entities/tb-quiz-keyword.entity';
import { UserChecklistProgress } from 'src/datasources/entities/tb-user-checklist-progress.entity';
import { SolvedQuizRepository } from 'src/datasources/repositories/tb-solved-quiz.repository';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';

const MIN_USER_ANSWER_LENGTH = 50;

interface GeminiErrorResponse {
  response?: {
    status?: number;
    data?: {
      error?: {
        details?: Array<{ reason?: string }>;
      };
    };
  };
  status?: number;
  message?: string;
}

@Injectable()
export class FeedbackService {
  private genAI: GoogleGenAI;

  constructor(
    private mainQuizRepository: MainQuizRepository,
    private solvedQuizRepository: SolvedQuizRepository,
    private speechesService: SpeechesService,
    private usersService: UsersService,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    this.genAI = new GoogleGenAI(apiKey);
  }

  async generateAIFeedback(requestDto: CreateAIFeedbackRequestDto) {
    // 데이터 조회
    const {
      mainQuizId,
      quizCategory,
      title,
      content,
      keywords,
      difficultyLevel,
    } = await this.getMainQuiz(requestDto.mainQuizId);
    const userAnswer = await this.speechesService.getSolvedQuizInfo(
      requestDto.solvedQuizId,
    );

    if (!userAnswer || userAnswer.trim().length < MIN_USER_ANSWER_LENGTH) {
      throw new BusinessException(ERROR_MESSAGES.ANSWER_TOO_SHORT);
    }

    const checklistInSolvedQuiz =
      await this.usersService.getUserChecklistProgress(requestDto.solvedQuizId);

    // ai 피드백
    const userPromptText = this.createTxtForAi(
      content,
      userAnswer,
      keywords,
      checklistInSolvedQuiz,
    );
    const aiFeedback = await this.analyzeAnswer(userPromptText);
    await this.updateAiFeedback(requestDto.solvedQuizId, aiFeedback);

    const result = {
      solvedQuizDetail: {
        mainQuizId,
        quizCategory,
        title,
        content,
        keywords,
        difficultyLevel,
        userChecklistProgress: this.toChecklistResponse(checklistInSolvedQuiz),
      },
      aiFeedbackResult: aiFeedback,
    };
    return result;
  }

  async analyzeAnswer(userText: string) {
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash-lite',

        config: {
          systemInstruction: AI_FEEDBACK_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: userText,
              },
            ],
          },
        ],
      });

      const textResponse = response.text;

      if (!textResponse) {
        throw new InternalServerErrorException('AI 응답이 비어있습니다.');
      }

      return JSON.parse(textResponse) as Record<string, unknown>;
    } catch (error: unknown) {
      const err = error as GeminiErrorResponse;
      const status = err.status ?? err.response?.status;
      const message = err.message ?? '';

      // 토큰 할당량 초과 (429)
      if (status === 429) {
        if (message.toLowerCase().includes('daily')) {
          throw new BusinessException(ERROR_MESSAGES.AI_DAILY_QUOTA_EXCEEDED);
        }

        throw new BusinessException(ERROR_MESSAGES.AI_RATE_LIMIT_EXCEEDED);
      }

      // 잘못된 요청 및 지역 제한 (400)
      if (status === 400) {
        // 안전 필터 관련 메시지가 포함된 경우 별도 처리
        if (message.toLowerCase().includes('safety')) {
          throw new BusinessException(ERROR_MESSAGES.AI_SAFETY_BLOCK);
        }

        // API 키 형식 오류
        if (message.toLowerCase().includes('api key')) {
          throw new BusinessException(ERROR_MESSAGES.AI_KEY_INVALID);
        }

        // 지역 미지원(Location) 또는 기타 파라미터 오류
        throw new BusinessException(ERROR_MESSAGES.AI_INVALID_REQUEST);
      }

      // API 키 권한 문제 (403)
      if (status === 403) {
        throw new BusinessException(ERROR_MESSAGES.AI_KEY_INVALID);
      }

      // 구글 서버 오류 (500, 503, 504)
      if (status && status >= 500) {
        throw new BusinessException(ERROR_MESSAGES.AI_SERVER_ERROR);
      }

      throw new InternalServerErrorException(
        '답변 분석 중 알 수 없는 오류가 발생했습니다.',
      );
    }
  }

  private async getMainQuiz(mainQuizId: number): Promise<MainQuiz> {
    const mainQuiz =
      await this.mainQuizRepository.findByIdWithDetails(mainQuizId);

    if (!mainQuiz) {
      throw new NotFoundException('해당 퀴즈가 존재하지 않습니다.');
    }

    return mainQuiz;
  }

  async updateAiFeedback(
    solvedQuizId: number,
    aiFeedBackObj: Record<string, unknown>,
  ) {
    const success = await this.solvedQuizRepository.updateAiFeedback(
      solvedQuizId,
      aiFeedBackObj,
    );
    if (!success)
      throw new InternalServerErrorException(
        'ai feedback을 저장하는데 오류가 발생하였습니다',
      );
  }

  async getAIFeedback(solvedQuizId: number) {
    // TODO: 추후에 로그인/회원가입 기능 구현 시에 userID 인자로 받아서 본인 기록 맞는지 검증하는 로직 추가
    const solvedQuiz = await this.solvedQuizRepository.getById(solvedQuizId);

    if (!solvedQuiz) {
      throw new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND);
    }

    if (!solvedQuiz.aiFeedback) {
      throw new BusinessException(ERROR_MESSAGES.SOLVED_QUIZ_NOT_FOUND);
    }
    const mainQuiz = await this.getMainQuiz(solvedQuiz.mainQuiz.mainQuizId);
    const checklistInSolvedQuiz =
      await this.usersService.getUserChecklistProgress(solvedQuizId);

    const result = {
      solvedQuizDetail: {
        mainQuizId: mainQuiz.mainQuizId,
        quizCategory: mainQuiz.quizCategory,
        title: mainQuiz.title,
        content: mainQuiz.content,
        keywords: mainQuiz.keywords,
        difficultyLevel: mainQuiz.difficultyLevel,
        userChecklistProgress: this.toChecklistResponse(checklistInSolvedQuiz),
      },
      aiFeedbackResult: solvedQuiz.aiFeedback,
    };
    return result;
  }

  // ai user prompt 텍스트 생성 함수
  private createTxtForAi(
    quizContent: string,
    userAnswer: string,
    keywords: QuizKeyword[],
    checklists: UserChecklistProgress[],
  ): string {
    const keywordsText = keywords.map((v) => v.keyword).join(', ');

    const userPrompt = `
    [퀴즈]
    ${quizContent}
    [사용자 답변]
    ${userAnswer}
    [사용자 체크리스트]
    ${checklists.map((checklist) => `${checklist.checklistItem.content} : ${checklist.isChecked}`).join('\n')}
    [핵심 키워드 목록]
    ${keywordsText}
    `;

    return userPrompt;
  }

  private toChecklistResponse(checklistInSolvedQuiz: UserChecklistProgress[]) {
    const total = checklistInSolvedQuiz.length;
    const checkedCount = checklistInSolvedQuiz.filter(
      (item) => item.isChecked === true,
    ).length;

    const userChecklistProgress = {
      checklistCount: total,
      checkedCount,
    };

    return userChecklistProgress;
  }
}
