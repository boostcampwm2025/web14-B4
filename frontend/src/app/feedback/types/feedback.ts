import { Importance } from '@/types/solvedQuiz.types';

export interface IncludedKeyword {
  keyword: string;
  isIncluded: boolean;
}

export interface AiResult {
  includedKeywords: IncludedKeyword[];
  keywordsFeedback: string;
  complementsFeedback: {
    title: string;
    content: string;
  }[];
  followUpQuestions: string[];
}

export interface SolvedQuizDetail {
  mainQuizId: number;
  quizCategory: {
    quizCategoryId: number;
    name: string;
  };
  title: string;
  content: string;
  difficultyLevel: '상' | '중' | '하';
  keywords: {
    keyword: string;
    description: string;
  }[];
  userChecklistProgress: {
    checklistCount: number;
    checkedCount: number;
  };
  importance: Importance;
}

export interface GetAIFeedbackResponseDto {
  solvedQuizDetail: SolvedQuizDetail;
  aiFeedbackResult: AiResult;
}
