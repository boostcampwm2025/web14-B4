import {
  GetAIFeedbackResponseDto,
  SolvedQuizResponseDto,
} from '@/app/checklist/types/checklist.types';
import { apiFetch } from './http/apiFetch';

export interface SolvedQuizSubmitRequestDto {
  mainQuizId: number;
  solvedQuizId: number;
  speechText: string;
  comprehensionLevel: string;
  checklistItems: {
    checklistItemId: number;
    isChecked: boolean;
  }[];
}

export interface getAIFeedBackRequestDto {
  mainQuizId: number;
  solvedQuizId: number;
}

export async function submitSolvedQuiz(req: SolvedQuizSubmitRequestDto) {
  const data = await apiFetch<SolvedQuizResponseDto>(
    '/users/solved-quizzes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    },
    { message: '나의 답변 및 체크리스트 저장이 실패했습니다.' },
  );

  return data;
}

export async function getAIFeedBack(req: getAIFeedBackRequestDto) {
  const data = await apiFetch<GetAIFeedbackResponseDto>(
    '/feedback',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    },
    { message: 'AI 피드백 생성을 실패했습니다.' },
  );

  return data;
}
