import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnImportance1769528974558 implements MigrationInterface {
  name = 'UpdateColumnImportance1769528974558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "tb_solved_quiz" SET "importance" = 'NORMAL' WHERE "importance" IS NULL`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_solved_quiz_user_state_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz" ALTER COLUMN "importance" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz" ALTER COLUMN "importance" SET DEFAULT 'NORMAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz" ALTER COLUMN "importance" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz" ALTER COLUMN "importance" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_solved_quiz_user_state_created" ON "tb_solved_quiz" ("created_at", "user_id", "main_quiz_id", "solved_state") WHERE (comprehension_level IS NOT NULL)`,
    );
  }
}
