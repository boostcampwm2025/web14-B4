export interface ChecklistItem {
  id: string;
  content: string;
  checked: boolean;
}

export interface ChecklistProps {
  username: string;
  selectedFeeling?: 'bad' | 'normal' | 'good';
  options: ChecklistItem[];
  onFeelingChange?: (feeling: 'bad' | 'normal' | 'good') => void;
  onOptionChange?: (optionId: string, checked: boolean) => void;
}

export interface QuizChecklistResponseDto {
  mainQuizId: number;
  title: string;
  content: string;
  difficultyLevel: string;
  checklistItems: ChecklistItemDto[];
}

export interface ChecklistItemDto {
  checklistItemId: number;
  sortOrder: number;
  content: string;
}
