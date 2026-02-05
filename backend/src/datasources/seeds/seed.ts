import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { EntityManager } from 'typeorm';
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

function logItemHeader(index: number, item: SeedJson): void {
  console.warn(
    `\n[${index}] 시작: category="${item.categoryName}", difficulty="${item.difficulty}", title="${item.mainQuiz?.title}"`,
  );
}

function logStep(message: string): void {
  console.warn(`  - ${message}`);
}

async function seedOne(manager: EntityManager, item: SeedJson): Promise<void> {
  const categoryRepo = manager.getRepository(QuizCategory);
  const mainQuizRepo = manager.getRepository(MainQuiz);
  const mcRepo = manager.getRepository(MultipleChoice);
  const mcOptionRepo = manager.getRepository(MultipleChoiceOption);
  const keywordRepo = manager.getRepository(QuizKeyword);
  const checklistRepo = manager.getRepository(ChecklistItem);

  // 1) categoryName -> quiz_category_id 추출 (없으면 생성)
  logStep(`tb_quiz_category: 조회 (name="${item.categoryName}")`);
  let category = await categoryRepo.findOne({
    where: { name: item.categoryName },
  });

  if (!category) {
    logStep('tb_quiz_category: 없음 → insert');
    category = categoryRepo.create({ name: item.categoryName });
    category = await categoryRepo.save(category);
    logStep(
      `tb_quiz_category: insert 성공 (quiz_category_id=${category.quizCategoryId})`,
    );
  } else {
    logStep(
      `tb_quiz_category: 기존 사용 (quiz_category_id=${category.quizCategoryId})`,
    );
  }

  // difficulty 검증
  assertDifficulty(item.difficulty);

  // 2) tb_main_quiz insert -> main_quiz_id 추출
  logStep('tb_main_quiz: insert');
  const mainQuiz = mainQuizRepo.create({
    quizCategory: category,
    difficultyLevel: item.difficulty,
    title: item.mainQuiz.title,
    content: item.mainQuiz.content,
    hint: item.mainQuiz.hint,
  });

  const savedMainQuiz = await mainQuizRepo.save(mainQuiz);
  logStep(
    `tb_main_quiz: insert 성공 (main_quiz_id=${savedMainQuiz.mainQuizId})`,
  );

  // 3~4) multipleChoices / options
  const multipleChoices = item.multipleChoices ?? [];
  logStep(`tb_multiple_choice: insert 예정 ${multipleChoices.length}건`);

  for (let i = 0; i < multipleChoices.length; i += 1) {
    const mc = multipleChoices[i];

    const multipleChoice = mcRepo.create({
      mainQuiz: savedMainQuiz,
      content: mc.content,
    });

    const savedMc = await mcRepo.save(multipleChoice);
    logStep(
      `tb_multiple_choice: [${i + 1}/${multipleChoices.length}] insert 성공 (multiple_choice_id=${savedMc.multipleChoiceId})`,
    );

    const optionsRaw = mc.options ?? [];
    const options = optionsRaw.map((opt) =>
      mcOptionRepo.create({
        multipleChoice: savedMc,
        option: opt.option,
        isCorrect: opt.isCorrect,
        explanation: opt.explanation,
      }),
    );

    if (options.length > 0) {
      await mcOptionRepo.save(options);
      logStep(
        `tb_multiple_choice_option: (multiple_choice_id=${savedMc.multipleChoiceId}) ${options.length}건 insert 성공`,
      );
    } else {
      logStep(
        `tb_multiple_choice_option: (multiple_choice_id=${savedMc.multipleChoiceId}) 0건 (skip)`,
      );
    }
  }

  // 5) tb_quiz_keywords
  const keywordsRaw = item.keywords ?? [];
  const keywords = keywordsRaw.map((k) =>
    keywordRepo.create({
      mainQuiz: savedMainQuiz,
      keyword: k.keyword,
      description: k.description,
    }),
  );

  if (keywords.length > 0) {
    await keywordRepo.save(keywords);
    logStep(`tb_quiz_keywords: ${keywords.length}건 insert 성공`);
  } else {
    logStep('tb_quiz_keywords: 0건 (skip)');
  }

  // 6) tb_checklist_item
  const checklistRaw = item.checklist ?? [];
  const checklistItems = checklistRaw.map((content, idx) =>
    checklistRepo.create({
      mainQuiz: savedMainQuiz,
      content,
      sortOrder: idx + 1,
    }),
  );

  if (checklistItems.length > 0) {
    await checklistRepo.save(checklistItems);
    logStep(`tb_checklist_item: ${checklistItems.length}건 insert 성공`);
  } else {
    logStep('tb_checklist_item: 0건 (skip)');
  }
}

async function main(): Promise<void> {
  const filePath = resolve(
    process.cwd(),
    'src/datasources/seeds/data/sample-quizzes.json',
  );

  console.warn(`seed 시작: ${filePath}`);

  await AppDataSource.initialize();

  try {
    const items = await loadJsonArray(filePath);
    const target = items.slice(0, SEED_LIMIT);

    console.warn(`로드 완료: ${items.length}건 (실행 ${target.length}건)`);

    for (let idx = 0; idx < target.length; idx += 1) {
      const item = target[idx];
      logItemHeader(idx + 1, item);

      await AppDataSource.transaction(async (manager) => {
        await seedOne(manager, item);
      });

      console.warn(`[${idx + 1}] 완료`);
    }

    console.warn('\nSeeding completed!');
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
