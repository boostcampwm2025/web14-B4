import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoice } from '../entities/tb-multiple-choice.entity';
import * as fs from 'fs';
import * as path from 'path';
import { MainQuiz } from '../entities/tb-main-quiz.entity';
import { MultipleChoiceOption } from '../entities/tb-multiple-choice-option.entity';

interface QuizChoice {
  option: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizQuestion {
  mainQuizId: number;
  content: string;
  choices: QuizChoice[];
}

interface QuizData {
  data: QuizQuestion[];
}

@Injectable()
export class MultipleChoiceQuizSeeder {
  constructor(
    @InjectRepository(MultipleChoice)
    private readonly multipleChoiceRepository: Repository<MultipleChoice>,
    @InjectRepository(MultipleChoiceOption)
    private readonly multipleChoiceOptionRepository: Repository<MultipleChoiceOption>,
    @InjectRepository(MainQuiz)
    private readonly quizRepository: Repository<MainQuiz>,
  ) {}

  async seed() {
    // JSON 파일 읽기
    const filePath = path.join(
      __dirname,
      'data',
      'multiple_choice_quizzes.json',
    );
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const quizzes = JSON.parse(jsonData) as QuizData;

    for (const quiz of quizzes.data) {
      const mainQuiz = await this.quizRepository.findOne({
        where: { mainQuizId: quiz.mainQuizId },
      });

      if (mainQuiz) {
        const multipleChoice = this.multipleChoiceRepository.create({
          content: quiz.content,
          mainQuiz: mainQuiz,
        });
        const savedQuiz =
          await this.multipleChoiceRepository.save(multipleChoice);

        for (const item of quiz.choices) {
          const choiceItem = this.multipleChoiceOptionRepository.create({
            multipleChoice: savedQuiz,
            option: item.option,
            isCorrect: item.isCorrect,
          });
          await this.multipleChoiceOptionRepository.save(choiceItem);
        }

        console.warn(
          `✅ 메인퀴즈 ID [${quiz.mainQuizId}]에 대한 객관식 퀴즈 ID [${savedQuiz.multipleChoiceId}]으로 생성되었습니다.`,
        );
      } else {
        console.error(
          `⏭️  메인퀴즈 ID [${quiz.mainQuizId}]가 존재하지 않습니다.`,
        );
      }
    }

    console.warn('[MultipleChoiceQuiz] seeding completed');
  }
}
