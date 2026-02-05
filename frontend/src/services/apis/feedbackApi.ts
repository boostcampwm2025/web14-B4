import { SolvedQuizResponseDto } from '@/app/checklist/types/checklist.types';
import { apiFetch } from '../http/apiFetch';
import { GetAIFeedbackResponseDto } from '@/app/feedback/types/feedback';

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

export async function generateAIFeedBack(req: getAIFeedBackRequestDto) {
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

export async function fetchAIFeedbackResult(solvedQuizId: number) {
  const data = await apiFetch<GetAIFeedbackResponseDto>(
    `/feedback/${solvedQuizId}`,
    {
      method: 'GET',
    },
    { message: 'AI 피드백 조회를 실패했습니다.' },
  );
  return data;
}

export async function fetchSpeechText(solvedQuizId: number) {
  const data = await apiFetch<{ speechText: string }>(
    `/feedback/${solvedQuizId}/speech-text`,
    {
      method: 'GET',
    },
    { message: '나의 답변 조회를 실패했습니다.' },
  );
  return data;
}
