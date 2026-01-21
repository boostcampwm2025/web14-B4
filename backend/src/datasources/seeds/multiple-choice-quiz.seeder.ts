import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultipleChoice } from '../entities/tb-multiple-choice.entity';
import * as fs from 'fs';
import * as path from 'path';
import { MainQuiz } from '../entities/tb-main-quiz.entity';
import { MultipleChoiceOption } from '../entities/tb-multiple-choice-option.entity';
import { Transactional } from 'typeorm-transactional';

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

    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (const quiz of quizzes.data) {
      try {
        await this.seedSingleQuiz(quiz);
        successCount++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (errorMessage.includes('메인퀴즈가 존재하지 않습니다')) {
          skipCount++;
          console.error(
            `⏭️  메인퀴즈 ID [${quiz.mainQuizId}]가 존재하지 않습니다.`,
          );
        } else {
          failCount++;
          console.error(
            `❌ 메인퀴즈 ID [${quiz.mainQuizId}]의 객관식 퀴즈 생성 실패:`,
            errorMessage,
          );
        }
      }
    }

    console.warn(
      `[MultipleChoiceQuiz] seeding completed - 성공: ${successCount}, 스킵: ${skipCount}, 실패: ${failCount}`,
    );
  }

  @Transactional()
  private async seedSingleQuiz(quiz: QuizQuestion) {
    // 데이터 유효성 검사
    if (!quiz.choices || quiz.choices.length === 0) {
      throw new Error(`choices 데이터가 없습니다`);
    }

    // 메인 퀴즈 존재 확인
    const mainQuiz = await this.quizRepository.findOne({
      where: { mainQuizId: quiz.mainQuizId },
    });

    if (!mainQuiz) {
      throw new Error('메인퀴즈가 존재하지 않습니다');
    }

    // 객관식 퀴즈 생성
    const multipleChoice = this.multipleChoiceRepository.create({
      content: quiz.content,
      mainQuiz: mainQuiz,
    });
    const savedQuiz = await this.multipleChoiceRepository.save(multipleChoice);

    // 선택지 생성
    for (const [index, item] of quiz.choices.entries()) {
      if (!item.option || item.isCorrect === undefined) {
        throw new Error(
          `${index + 1}번째 선택지 데이터가 유효하지 않습니다: ${JSON.stringify(item)}`,
        );
      }

      const choiceItem = this.multipleChoiceOptionRepository.create({
        multipleChoice: savedQuiz,
        option: item.option,
        isCorrect: item.isCorrect,
        explanation: item.explanation,
      });
      await this.multipleChoiceOptionRepository.save(choiceItem);
    }

    console.warn(
      `✅ 메인퀴즈 ID [${quiz.mainQuizId}]에 대한 객관식 퀴즈 ID [${savedQuiz.multipleChoiceId}]으로 생성되었습니다.`,
    );
  }
}
