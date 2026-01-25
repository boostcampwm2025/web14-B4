import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumSolvedState1769270302275 implements MigrationInterface {
  name = 'AddColumSolvedState1769270302275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tb_solved_quiz_solved_state_enum" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz" ADD "solved_state" "public"."tb_solved_quiz_solved_state_enum" NOT NULL DEFAULT 'NOT_STARTED'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz" DROP COLUMN "solved_state"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tb_solved_quiz_solved_state_enum"`,
    );
  }
}
