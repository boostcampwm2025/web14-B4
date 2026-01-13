import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class FeedbackService {
  private genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyzeAnswer(quizTitle: string, userAnswer: string) {
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash-lite',

        config: {
          systemInstruction: `
            당신은 컴퓨터 과학(CS) 기술 면접관입니다. 
            사용자의 답변을 분석하여 학습을 돕는 피드백을 제공하세요.
            반드시 아래 JSON 스키마를 준수하여 응답하세요:
            
            {
              "checklist": [
                {"content": "핵심 키워드 포함 여부 (문장)", "isPass": boolean},
                {"content": "개념의 정확한 정의 설명 여부 (문장)", "isPass": boolean}
              ],
              "feedback": "사용자에게 전하는 따뜻하고 구체적인 피드백 (경어체)",
              "followUpQuestions": ["답변을 확장시킬 수 있는 꼬리질문 1", "꼬리질문 2", "꼬리질문 3"]
            }
          `,
          temperature: 0.1,
          responseMimeType: 'application/json',
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },

        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `[퀴즈 내용]: ${quizTitle}\n[사용자 답변]: ${userAnswer}`,
              },
            ],
          },
        ],
      });

      const textResponse = response.text;

      if (!textResponse) {
        throw new Error('AI 응답이 비어있습니다.');
      }

      return JSON.parse(textResponse) as Record<string, any>;
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new InternalServerErrorException(
        '답변 분석 중 오류가 발생했습니다.',
      );
    }
  }
}
