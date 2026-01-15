export interface IncludedKeyword {
  keyword: string;
  isIncluded: boolean;
}

export interface AiResult {
  includedKwyWords: IncludedKeyword[];
  feedback: string;
  followUpQuestions: string[];
}

export interface MainQuizDetail {
  mainQuizId: number;
  content: string;
}

export interface GetAIFeedbackResponseDto {
  data: {
    mainQuizDetail: MainQuizDetail;
    answer: string;
  };
  result: AiResult;
}
