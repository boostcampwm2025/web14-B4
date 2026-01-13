import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ChecklistItem } from './entities/tb-checklist-item.entity';
import { Flashcard } from './entities/tb-flashcard.entity';
import { FollowUpQuestion } from './entities/tb-follow-up-question.entity';
import { MainQuiz } from './entities/tb-main-quiz.entity';
import { MultipleChoiceOption } from './entities/tb-multiple-choice-option.entity';
import { MultipleChoice } from './entities/tb-multiple-choice.entity';
import { QuizCategory } from './entities/tb-quiz-category.entity';
import { QuizKeyword } from './entities/tb-quiz-keyword.entity';
import { SolvedQuiz } from './entities/tb-solved-quiz.entity';
import { UserChecklistProgress } from './entities/tb-user-checklist-progress.entity';
import { User } from './entities/tb-user.entity';

// Repositories
import { ChecklistItemRepository } from './repositories/tb-checklist-item.repository';
import { FlashcardRepository } from './repositories/tb-flashcard.repository';
import { FollowUpQuestionRepository } from './repositories/tb-follow-up-question.repository';
import { MainQuizRepository } from './repositories/tb-main-quiz.repository';
import { MultipleChoiceOptionRepository } from './repositories/tb-multiple-choice-option.repository';
import { MultipleChoiceRepository } from './repositories/tb-multiple-choice.repository';
import { QuizCategoryRepository } from './repositories/tb-quiz-category.repository';
import { QuizKeywordRepository } from './repositories/tb-quiz-keyword.repository';
import { SolvedQuizRepository } from './repositories/tb-solved-quiz.repository';
import { UserChecklistProgressRepository } from './repositories/tb-user-checklist-progress.repository';
import { UserRepository } from './repositories/tb-user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChecklistItem,
      Flashcard,
      FollowUpQuestion,
      MainQuiz,
      MultipleChoiceOption,
      MultipleChoice,
      QuizCategory,
      QuizKeyword,
      SolvedQuiz,
      UserChecklistProgress,
      User,
    ]),
  ],
  providers: [
    ChecklistItemRepository,
    FlashcardRepository,
    FollowUpQuestionRepository,
    MainQuizRepository,
    MultipleChoiceOptionRepository,
    MultipleChoiceRepository,
    QuizCategoryRepository,
    QuizKeywordRepository,
    SolvedQuizRepository,
    UserChecklistProgressRepository,
    UserRepository,
  ],
  exports: [
    TypeOrmModule,
    ChecklistItemRepository,
    FlashcardRepository,
    FollowUpQuestionRepository,
    MainQuizRepository,
    MultipleChoiceOptionRepository,
    MultipleChoiceRepository,
    QuizCategoryRepository,
    QuizKeywordRepository,
    SolvedQuizRepository,
    UserChecklistProgressRepository,
    UserRepository,
  ],
})
export class DatasourcesModule {}
