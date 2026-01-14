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

@Injectable()
export class FeedbackService {
  private genAI: GoogleGenAI;

  constructor(
    private mainQuizRepository: MainQuizRepository,
    private speechesService: SpeechesService,
    private usersService: UsersService,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    this.genAI = new GoogleGenAI(apiKey);
  }

  async generateAIFeedback(
    userId: number,
    requestDto: CreateAIFeedbackRequestDto,
  ) {
    // 퀴즈 정보 조회(퀴즈 및 체크리스트, 핵심키워드 정보 포함)
    const mainQuizDetail = await this.getMainQuiz(requestDto.mainQuizId);

    // 나의 답변 가져오기
    const answer = await this.speechesService.getSolvedQuizInfo(
      requestDto.solvedQuizId,
    );

    // 유저가 선택한 체크리스트 목록 가져오기
    const userChecklistProgress = await this.usersService.getUserChecklistItems(
      userId,
      requestDto.mainQuizId,
      requestDto.solvedQuizId,
    );

    // AI 프롬프트 구성
    // AI API 호출
    // 피드백 저장
    const result = {
      data: { mainQuizDetail, answer, userChecklistProgress },
      result: '피드백 내용이 여기에 저장됩니다.',
    };
    return result;
  }

  async analyzeAnswer(quizContent: string, userAnswer: string) {
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash-lite',

        config: {
          systemInstruction: AI_FEEDBACK_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.1,
        },

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: this.createUserTxt(quizContent, userAnswer),
              },
            ],
          },
        ],
      });

      const textResponse = response.text;

      if (!textResponse) {
        throw new Error('AI 응답이 비어있습니다.');
      }

      return JSON.parse(textResponse) as Record<string, unknown>;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new InternalServerErrorException(
        '답변 분석 중 오류가 발생했습니다.',
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

  private createUserTxt(quizContent: string, userAnswer: string): string {
    const txt = `
    [퀴즈]
    ${quizContent}

    [사용자 답변]
    ${userAnswer}

    [사용자 체크리스트]
    - (체크 항목 1): ✅ 또는 ❌
    ...

    [핵심 키워드 목록]
    키워드1, 키워드2, 키워드3, ...
    `;

    return txt;
  }
}
