import { Injectable } from '@nestjs/common';
import {
  MainQuizEntity,
  DifficultyLevel,
} from '../../datasources/entities/main-quiz.entity';

interface MockQuiz {
  id: number;
  title: string;
  content: string;
  hint: string;
  difficulty: DifficultyLevel;
  category: { id: number; name: string };
}

@Injectable()
export class QuizService {
  private readonly mockData: MockQuiz[] = [
    {
      id: 1,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.MID,
      category: { id: 1, name: '운영체제' },
    },
    {
      id: 2,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HIGH,
      category: { id: 2, name: '데이터베이스' },
    },
    {
      id: 3,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.LOW,
      category: { id: 3, name: '네트워크' },
    },
    {
      id: 4,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HIGH,
      category: { id: 1, name: '운영체제' },
    },
    {
      id: 5,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.LOW,
      category: { id: 2, name: '데이터베이스' },
    },
    {
      id: 6,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.MID,
      category: { id: 3, name: '네트워크' },
    },
    {
      id: 7,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HIGH,
      category: { id: 1, name: '운영체제' },
    },
    {
      id: 8,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HIGH,
      category: { id: 2, name: '데이터베이스' },
    },
    {
      id: 9,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.LOW,
      category: { id: 3, name: '네트워크' },
    },
    {
      id: 10,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.LOW,
      category: { id: 1, name: '운영체제' },
    },
    {
      id: 11,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.MID,
      category: { id: 2, name: '데이터베이스' },
    },
    {
      id: 12,
      title: '프로세스와 스레드의 차이',
      content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
      hint: '메모리 공유 여부를 생각해보세요.',
      difficulty: DifficultyLevel.HIGH,
      category: { id: 3, name: '네트워크' },
    },
  ];

  private readonly mockCategories = [
    { id: 1, name: '운영체제' },
    { id: 2, name: '데이터베이스' },
    { id: 3, name: '네트워크' },
  ];

  async findAll(
    category?: string,
    difficulty?: DifficultyLevel,
  ): Promise<MainQuizEntity[]> {
    let results = [...this.mockData];

    if (category) {
      results = results.filter((quiz) => quiz.category.name === category);
    }

    if (difficulty) {
      results = results.filter((quiz) => quiz.difficulty === difficulty);
    }
    return Promise.resolve(results as unknown as MainQuizEntity[]);
  }

  getCategoriesWithCount() {
    const totalCount = this.mockData.length;
    const categories = this.mockCategories.map((category) => {
      const count = this.mockData.filter(
        (quiz) => quiz.category?.name === category.name,
      ).length;
      return {
        ...category,
        count,
      };
    });
    return { totalCount, categories };
  }

  findOne(id: number): Promise<MainQuizEntity | undefined> {
    const quiz = this.mockData.find((q) => q.id === id);
    return Promise.resolve(quiz as unknown as MainQuizEntity | undefined);
  }
}
