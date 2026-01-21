export class QuizChecklistResponseDto {
  mainQuizId: number;
  title: string;
  content: string;
  difficultyLevel: string;
  checklistItems: ChecklistItemDto[];

  constructor(data: {
    mainQuizId: number;
    title: string;
    content: string;
    difficultyLevel: string;
    checklistItems: ChecklistItemDto[];
  }) {
    this.mainQuizId = data.mainQuizId;
    this.title = data.title;
    this.content = data.content;
    this.difficultyLevel = data.difficultyLevel;
    this.checklistItems = data.checklistItems;
  }
}

export class ChecklistItemDto {
  checklistItemId: number;
  sortOrder: number;
  content: string;
}

export class MultipleChoicesResponseDto {
  mainQuizId: number;
  totalCount: number;
  multipleChoices: MultipleChoiceDto[];
}

export class MultipleChoiceDto {
  multipleChoiceId: number;
  content: string;
  options: MultipleChoiceOptionDto[];
}

export class MultipleChoiceOptionDto {
  multipleQuizOptionId: number;
  option: string;
  isCorrect: boolean;
  explanation: string | null;
}
