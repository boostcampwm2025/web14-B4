import { apiFetch } from './http/apiFetch';
import { AiFeedbackResponse } from '@/app/feedback/types/feedback';

export const fetchAiFeedback = async (
  mainQuizId: number,
  solvedQuizId: number,
): Promise<AiFeedbackResponse> => {
  return await apiFetch<AiFeedbackResponse>('/feedback', {
    method: 'POST',
    body: JSON.stringify({
      mainQuizId,
      solvedQuizId,
    }),
  });
};
