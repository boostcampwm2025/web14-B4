export interface ChecklistItem {
  id: string;
  content: string;
  checked: boolean;
}

export interface ChecklistProps {
  username: string;
  selectedFeeling?: 'LOW' | 'HIGH' | 'NORMAL';
  options: ChecklistItem[];
  onFeelingChange?: (feeling: 'LOW' | 'HIGH' | 'NORMAL') => void;
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
  checklistItemId: string;
  sortOrder: number;
  content: string;
}

export interface SolvedQuizResponseDto {
  mainQuizId: number;
  solvedQuizId: number;
}

// TODO AI 피드백 결과에 따른 타입으로 수정 필요 !
export interface GetAIFeedbackResponseDto {
  result: JSON;
}
