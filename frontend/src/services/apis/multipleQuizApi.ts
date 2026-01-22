import { MultipleChoiceResponseDto } from '@/types/multipleChoice.types';
import { apiFetch } from '../http/apiFetch';

export async function fetchMultipleChoices(mainQuizId: number): Promise<MultipleChoiceResponseDto> {
  const multipleChoiceQuiz = await apiFetch<MultipleChoiceResponseDto>(
    `/quizzes/${mainQuizId}/multiple-choices`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      message: '객관식 퀴즈 데이터 조회 중 문제가 발생하였습니다.',
    },
  );
  return multipleChoiceQuiz;
}
