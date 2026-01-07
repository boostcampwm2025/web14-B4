export class SaveChecklistProgressDto {
  mainQuizId: number;
  checklistItems: ChecklistPregressItemDto[];

  constructor(data: {
    mainQuizId: number;
    checklistItems: ChecklistPregressItemDto[];
  }) {
    this.mainQuizId = data.mainQuizId;
    this.checklistItems = data.checklistItems;
  }
}

export class ChecklistPregressItemDto {
  checklistItemId: number;
  isChecked: boolean;

  constructor(data: { checklistItemId: number; isChecked: boolean }) {
    this.checklistItemId = data.checklistItemId;
    this.isChecked = data.isChecked;
  }
}
