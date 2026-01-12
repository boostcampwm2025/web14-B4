import { MainQuiz } from '../../datasources/entities/tb-main-quiz.entity';
import { ChecklistItem } from '../../datasources/entities/tb-checklist-item.entity';
import { QuizCategory } from '../../datasources/entities/tb-quiz-category.entity';

export class QuizFixture {

  static createQuizCategory(overrides: Partial<QuizCategory> = {}): QuizCategory {
    const quizCategory = new QuizCategory(); // 👈 new 키워드 사용
    quizCategory.quizCategoryId = 1;
    quizCategory.name = '네트워크';
    
    Object.assign(quizCategory, overrides);
    return quizCategory;
  }

  /**
   * TbMainQuiz 엔티티 Mock 데이터 생성
   */
  static createQuiz(overrides: Partial<MainQuiz> = {}): MainQuiz {
    const now = new Date();

    const quiz = new MainQuiz(); // 👈 new 키워드 사용
    quiz.mainQuizId = 1;
    quiz.quizCategory = this.createQuizCategory(); // 👈 메서드 재사용
    quiz.difficultyLevel = 'MEDIUM' as any;
    quiz.title = '테스트 퀴즈';
    quiz.content = '퀴즈 내용';
    quiz.hint = '힌트 내용';
    quiz.createdAt = now;
    quiz.updatedAt = now;
    quiz.checklistItems = [];

    // checklistItems가 overrides에 없으면 기본값 설정
    if (!overrides.checklistItems) {
      quiz.checklistItems = this.createChecklistItems(2, quiz.mainQuizId);
    }

    Object.assign(quiz, overrides); // 👈 overrides 적용
    return quiz;
  }

  /**
   * TbChecklistItem 엔티티 Mock 데이터 배열 생성
   */
  static createChecklistItems(
    count: number,
    mainQuizId: number = 1,
  ): ChecklistItem[] {
    const now = new Date();

    return Array.from({ length: count }, (_, i) => {
      const item = new ChecklistItem(); // 👈 new 키워드 사용
      item.checklistItemId = i + 1;
      item.mainQuizId = mainQuizId;
      item.content = `체크리스트 항목 ${i + 1}`;
      item.sortOrder = i + 1;
      item.createdAt = now;
      item.updatedAt = now;
      item.mainQuiz = new MainQuiz(); // 순환 참조 방지
      item.userProgress = [];
      
      return item;
    });
  }

  /**
   * 체크리스트가 없는 퀴즈
   */
  static createQuizWithoutChecklist(): MainQuiz {
    return this.createQuiz({ checklistItems: [] });
  }

  /**
   * 6개 항목이 있는 퀴즈
   */
  static createQuizWith6Items(): MainQuiz {
    return this.createQuiz({
      checklistItems: this.createChecklistItems(6, 1),
    });
  }
}