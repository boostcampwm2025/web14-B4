export interface MultipleChoiceOption {
  multipleQuizOptionId: number;
  option: string;
  isCorrect: boolean;
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
