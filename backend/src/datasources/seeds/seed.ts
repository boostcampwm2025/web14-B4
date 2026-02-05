import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AppDataSource } from '../../config/data-source';

import { QuizCategory } from '../entities/tb-quiz-category.entity';
import { MainQuiz, DifficultyLevel } from '../entities/tb-main-quiz.entity';
import { MultipleChoice } from '../entities/tb-multiple-choice.entity';
import { MultipleChoiceOption } from '../entities/tb-multiple-choice-option.entity';
import { QuizKeyword } from '../entities/tb-quiz-keyword.entity';
import { ChecklistItem } from '../entities/tb-checklist-item.entity';

type SeedJson = {
  categoryName: string;
  difficulty: DifficultyLevel; // '상' | '중' | '하'
  mainQuiz: {
    title: string;
    content: string;
    hint?: string;
  };
  multipleChoices: Array<{
    content: string;
    options: Array<{
      option: string;
      isCorrect: boolean;
      explanation?: string;
    }>;
  }>;
  checklist: string[];
  keywords: Array<{
    keyword: string;
    description?: string;
  }>;
};

const SEED_LIMIT = 10;

function assertDifficulty(value: string): asserts value is DifficultyLevel {
  const allowed: string[] = [
    DifficultyLevel.HARD,
    DifficultyLevel.MEDIUM,
    DifficultyLevel.EASY,
  ];

  if (allowed.includes(value) === false) {
    throw new Error(`difficulty 값이 올바르지 않음: ${value}`);
  }
}

async function loadJsonArray(filePath: string): Promise<SeedJson[]> {
  const raw = await readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed) === false) {
    throw new Error('seed json 파일은 배열이어야 함');
  }

  return parsed as SeedJson[];
}

async function seedOne(manager: any, item: SeedJson): Promise<void> {
  const categoryRepo = manager.getRepository(QuizCategory);
  const mainQuizRepo = manager.getRepository(MainQuiz);
  const mcRepo = manager.getRepository(MultipleChoice);
  const mcOptionRepo = manager.getRepository(MultipleChoiceOption);
  const keywordRepo = manager.getRepository(QuizKeyword);
  const checklistRepo = manager.getRepository(ChecklistItem);

  // 1) categoryName -> quiz_category_id 추출 (없으면 생성)
  let category = await categoryRepo.findOne({
    where: { name: item.categoryName },
  });

  if (!category) {
    category = categoryRepo.create({ name: item.categoryName });
    category = await categoryRepo.save(category);
  }

  // difficulty 검증 (enum 값 불일치 방지)
  assertDifficulty(item.difficulty);

  // 2) tb_main_quiz insert -> main_quiz_id 확보
  const mainQuiz = mainQuizRepo.create({
    quizCategory: category,
    difficultyLevel: item.difficulty,
    title: item.mainQuiz.title,
    content: item.mainQuiz.content,
    hint: item.mainQuiz.hint,
  });

  const savedMainQuiz = await mainQuizRepo.save(mainQuiz);

  // 3) tb_multiple_choice insert -> multiple_choice_id 확보
  for (const mc of item.multipleChoices ?? []) {
    const multipleChoice = mcRepo.create({
      mainQuiz: savedMainQuiz,
      content: mc.content,
    });

    const savedMc = await mcRepo.save(multipleChoice);

    // 4) tb_multiple_choice_option insert (options)
    const options = (mc.options ?? []).map((opt) =>
      mcOptionRepo.create({
        multipleChoice: savedMc,
        option: opt.option,
        isCorrect: opt.isCorrect,
        explanation: opt.explanation,
      }),
    );

    if (options.length > 0) {
      await mcOptionRepo.save(options);
    }
  }

  // 5) tb_quiz_keywords insert
  const keywords = (item.keywords ?? []).map((k) =>
    keywordRepo.create({
      mainQuiz: savedMainQuiz,
      keyword: k.keyword,
      description: k.description,
    }),
  );

  if (keywords.length > 0) {
    await keywordRepo.save(keywords);
  }

  // 6) tb_checklist_item insert (sort_order 1부터)
  const checklistItems = (item.checklist ?? []).map((content, idx) =>
    checklistRepo.create({
      mainQuiz: savedMainQuiz,
      content,
      sortOrder: idx + 1,
    }),
  );

  if (checklistItems.length > 0) {
    await checklistRepo.save(checklistItems);
  }
}

async function main(): Promise<void> {
  const filePath = resolve(
    process.cwd(),
    'src/datasources/seeds/data/sample-quizzes.json',
  );

  await AppDataSource.initialize();

  try {
    const items = await loadJsonArray(filePath);
    const target = items.slice(0, SEED_LIMIT);

    for (const item of target) {
      await AppDataSource.transaction(async (manager) => {
        await seedOne(manager, item);
      });
    }
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
