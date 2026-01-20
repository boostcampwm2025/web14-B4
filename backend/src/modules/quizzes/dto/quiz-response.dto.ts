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

export class GetMultipleChoicesResponseDto {
  mainQuizId: number;
  multipleChoices: MultipleChoiceResponseDto[];
}

export class MultipleChoiceResponseDto {
  multipleChoiceId: number;
  content: string | null;
  options: MultipleChoiceOptionResponseDto[];
}

export class MultipleChoiceOptionResponseDto {
  multipleQuizOptionId: number;
  option: string;
  isCorrect: boolean;
}
