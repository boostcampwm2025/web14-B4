import { Injectable } from '@nestjs/common';
import { MainQuizEntity, DifficultyLevel } from './entities/main-quiz.entity';

@Injectable()
export class QuizService {
    private readonly mockData: any[] = [
        {
            id: 1,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.MID,
            category: { id: 1, name: '운영체제' }
        },
        {
            id: 2,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.LOW,
            category: { id: 2, name: '데이터베이스' }
        },
        {
            id: 3,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.HIGH,
            category: { id: 3, name: '네트워크' }
        },
        {
            id: 1,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.MID,
            category: { id: 1, name: '운영체제' }
        },
        {
            id: 2,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.LOW,
            category: { id: 2, name: '데이터베이스' }
        },
        {
            id: 3,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.HIGH,
            category: { id: 3, name: '네트워크' }
        },
        {
            id: 4,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.MID,
            category: { id: 1, name: '운영체제' }
        },
        {
            id: 5,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.LOW,
            category: { id: 2, name: '데이터베이스' }
        },
        {
            id: 6,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.HIGH,
            category: { id: 3, name: '네트워크' }
        },
        {
            id: 7,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.MID,
            category: { id: 1, name: '운영체제' }
        },
        {
            id: 8,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.LOW,
            category: { id: 2, name: '데이터베이스' }
        },
        {
            id: 9,
            title: '프로세스와 스레드의 차이',
            content: '프로세스와 스레드의 결정적인 차이는 무엇일까요?',
            hint: '메모리 공유 여부를 생각해보세요.',
            difficultyLevel: DifficultyLevel.HIGH,
            category: { id: 3, name: '네트워크' }
        },
    ];

    async findAll(): Promise<MainQuizEntity[]> {
        return await this.mockData as MainQuizEntity[];
    }
}