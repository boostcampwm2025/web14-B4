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
  quizCategory: string;
  title: string;
  content: string;
  keywords: { keyword: string }[];
  userChecklistProgress: {
    checklistCount: number;
    checkedCount: number;
  };
}

export interface GetAIFeedbackResponseDto {
  solvedQuizDetail: SolvedQuizDetail;
  aiFeedbackResult: AiResult;
}
