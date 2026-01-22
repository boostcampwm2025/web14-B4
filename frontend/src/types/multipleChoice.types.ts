export interface MultipleChoiceOption {
  multipleQuizOptionId: number;
  option: string;
  isCorrect: boolean;
  explanation: string | null;
}

export interface MultipleChoice {
  multipleChoiceId: number;
  content: string;
  options: MultipleChoiceOption[];
}

export interface MultipleChoiceResponseDto {
  mainQuizId: number;
  totalCount: number;
  multipleChoices: MultipleChoice[];
}
