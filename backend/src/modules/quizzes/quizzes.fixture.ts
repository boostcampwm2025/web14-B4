import { TbMainQuiz } from '../../datasources/entities/tb-main-quiz.entity';
import { TbChecklistItem } from '../../datasources/entities/tb-checklist-item.entity';

export class QuizFixture {
  /**
   * TbMainQuiz 엔티티 Mock 데이터 생성
   */
  static createQuiz(overrides: Partial<TbMainQuiz> = {}): TbMainQuiz {
    const now = new Date();

    const quiz: TbMainQuiz = {
      mainQuizId: 1,
      quizCategoryId: 1,
      difficultyLevel: 'MEDIUM',
      title: '테스트 퀴즈',
      content: '퀴즈 내용',
      hint: '힌트 내용',
      createdAt: now,
      updatedAt: now,
      checklistItems: [],
      ...overrides,
    };

    // checklistItems가 overrides에 없으면 기본값 설정
    if (!overrides.checklistItems) {
      quiz.checklistItems = this.createChecklistItems(2, quiz.mainQuizId);
    }

    return quiz;
  }

  /**
   * TbChecklistItem 엔티티 Mock 데이터 배열 생성
   */
  static createChecklistItems(
    count: number,
    mainQuizId: number = 1,
  ): TbChecklistItem[] {
    const now = new Date();

    return Array.from({ length: count }, (_, i) => {
      const item: TbChecklistItem = {
        checklistItemId: i + 1,
        mainQuizId,
        content: `체크리스트 항목 ${i + 1}`,
        sortOrder: i + 1,
        createdAt: now,
        updatedAt: now,
        mainQuiz: {} as TbMainQuiz, // 순환 참조 방지를 위한 빈 객체
        userProgress: [],
      };
      return item;
    });
  }

  /**
   * 체크리스트가 없는 퀴즈
   */
  static createQuizWithoutChecklist(): TbMainQuiz {
    return this.createQuiz({ checklistItems: [] });
  }

  /**
   * 6개 항목이 있는 퀴즈
   */
  static createQuizWith6Items(): TbMainQuiz {
    return this.createQuiz({
      checklistItems: this.createChecklistItems(6, 1),
    });
  }

  /**
   * 특정 난이도의 퀴즈
   */
  static createQuizWithDifficulty(
    difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD',
  ): TbMainQuiz {
    return this.createQuiz({ difficultyLevel });
  }
}
