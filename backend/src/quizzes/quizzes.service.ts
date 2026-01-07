import { Injectable, NotFoundException } from '@nestjs/common';
import { TbMainQuizRepository } from '../datasources/repositories/tb-main-quiz.respository';
import { QuizChecklistResponseDto } from './dto/quiz-response.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizRepository: TbMainQuizRepository) {}

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
