import {
  Importance,
  SolvedQuiz,
} from 'src/datasources/entities/tb-solved-quiz.entity';
import {
  QuizImportanceDataDto,
  QuizImportanceItemDto,
} from '../dto/quiz-importance-response.dto';

/**
 * SolvedQuiz 데이터를 QuizImportanceData로 맵핑시키는 함수
 */
export function mapSolvedQuizzesToImportanceData(
  solvedQuizzes: SolvedQuiz[],
): QuizImportanceDataDto {
  const high: QuizImportanceItemDto[] = [];
  const normal: QuizImportanceItemDto[] = [];
  const low: QuizImportanceItemDto[] = [];

  solvedQuizzes.forEach((quiz) => {
    const item: QuizImportanceItemDto = {
      solvedQuizId: quiz.solvedQuizId,
      category: quiz.mainQuiz.quizCategory.name,
      mainQuizId: quiz.mainQuiz.mainQuizId,
      mainQuizTitle: quiz.mainQuiz.title,
      createdAt: quiz.createdAt.toISOString(),
    };

    if (quiz.importance === Importance.HIGH) {
      high.push(item);
    } else if (quiz.importance === Importance.NORMAL) {
      normal.push(item);
    } else if (quiz.importance === Importance.LOW) {
      low.push(item);
    }
  });

  return { high, normal, low };
}
