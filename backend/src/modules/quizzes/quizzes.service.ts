import { Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../datasources/repositories/tb-main-quiz.respository';
import { QuizChecklistResponseDto } from './dto/quiz-response.dto';
import {
  MainQuiz,
  DifficultyLevel,
} from '../../datasources/entities/tb-main-quiz.entity';

interface MockQuiz {
  id: number;
  title: string;
  content: string;
  hint: string;
  difficulty: DifficultyLevel;
  quizCategory: { id: number; name: string };
}

@Injectable()
export class QuizzesService {
  private readonly mockData: MockQuiz[] = [
    {
      id: 1,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.EASY,
      quizCategory: { id: 1, name: '운영체제' },
    },
    {
      id: 2,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HARD,
      quizCategory: { id: 2, name: '데이터베이스' },
    },
    {
      id: 3,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.EASY,
      quizCategory: { id: 3, name: '네트워크' },
    },
    {
      id: 4,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HARD,
      quizCategory: { id: 1, name: '운영체제' },
    },
    {
      id: 5,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.EASY,
      quizCategory: { id: 2, name: '데이터베이스' },
    },
    {
      id: 6,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.MEDIUM,
      quizCategory: { id: 3, name: '네트워크' },
    },
    {
      id: 7,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HARD,
      quizCategory: { id: 1, name: '운영체제' },
    },
    {
      id: 8,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HARD,
      quizCategory: { id: 2, name: '데이터베이스' },
    },
    {
      id: 9,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.EASY,
      quizCategory: { id: 3, name: '네트워크' },
    },
    {
      id: 10,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.EASY,
      quizCategory: { id: 1, name: '운영체제' },
    },
    {
      id: 11,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.MEDIUM,
      quizCategory: { id: 2, name: '데이터베이스' },
    },
    {
      id: 12,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HARD,
      quizCategory: { id: 3, name: '네트워크' },
    },
  ];

  private readonly mockCategories = [
    { id: 1, name: '운영체제' },
    { id: 2, name: '데이터베이스' },
    { id: 3, name: '네트워크' },
  ];

  constructor(private readonly quizRepository: MainQuizRepository) {}

  async findAll(
    category?: string,
    difficulty?: DifficultyLevel,
  ): Promise<MainQuiz[]> {
    let results = [...this.mockData];

    if (category) {
      results = results.filter((quiz) => quiz.quizCategory.name === category);
    }

    if (difficulty) {
      results = results.filter((quiz) => quiz.difficulty === difficulty);
    }
    return Promise.resolve(results as unknown as MainQuiz[]);
  }

  getCategoriesWithCount() {
    const totalCount = this.mockData.length;
    const categories = this.mockCategories.map((category) => {
      const count = this.mockData.filter(
        (quiz) => quiz.quizCategory?.name === category.name,
      ).length;
      return {
        ...category,
        count,
      };
    });
    return { totalCount, categories };
  }

  findOne(id: number): Promise<MainQuiz | undefined> {
    const quiz = this.mockData.find((q) => q.id === id);
    return Promise.resolve(quiz as unknown as MainQuiz | undefined);
  }

  async getQuizChecklist(mainQuizId: number) {
    const quiz = await this.quizRepository.findOneWithChecklist(mainQuizId);

    if (!quiz) {
      throw new NotFoundException(`해당 퀴즈를 찾을 수 없습니다.`);
    }

    if (quiz.checklistItems.length <= 0)
      throw new NotFoundException(
        `해당 퀴즈에 대한 체크리스트가 존재하지 않습니다.`,
      );

    return new QuizChecklistResponseDto({
      mainQuizId: quiz.mainQuizId,
      title: quiz.title,
      content: quiz.content,
      difficultyLevel: quiz.difficultyLevel,
      checklistItems: quiz.checklistItems.map((item) => ({
        checklistItemId: item.checklistItemId,
        sortOrder: item.sortOrder,
        content: item.content,
      })),
    });
  }
}
