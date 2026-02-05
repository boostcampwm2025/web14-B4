import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1000000000000 implements MigrationInterface {
  name = 'InitialSchema1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tb_user_checklist_progress" (
        "user_checklist_progress_id" BIGSERIAL NOT NULL,
        "is_checked" boolean DEFAULT false,
        "checked_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" bigint NOT NULL,
        "checklist_item_id" bigint NOT NULL,
        "solved_quiz_id" bigint NOT NULL,
        CONSTRAINT "uk_user_checklist_quiz" UNIQUE ("user_id","checklist_item_id","solved_quiz_id"),
        CONSTRAINT "PK_275affaba106e19e7437aee2422" PRIMARY KEY ("user_checklist_progress_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_checklist_item" (
        "checklist_item_id" BIGSERIAL NOT NULL,
        "content" character varying(255),
        "sort_order" bigint,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "main_quiz_id" bigint NOT NULL,
        CONSTRAINT "PK_61dc8c1b1266e60606982cdc5ee" PRIMARY KEY ("checklist_item_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_quiz_category" (
        "quiz_category_id" BIGSERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        CONSTRAINT "PK_6650e6fd98ae98cf46b745c498e" PRIMARY KEY ("quiz_category_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_quiz_keywords" (
        "quiz_keyword_id" BIGSERIAL NOT NULL,
        "keyword" character varying(255) NOT NULL,
        "description" text,
        "main_quiz_id" bigint NOT NULL,
        CONSTRAINT "PK_553c3a6ae235d87f8833feaea5f" PRIMARY KEY ("quiz_keyword_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."tb_main_quiz_difficulty_level_enum" AS ENUM ('상','중','하')`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_main_quiz" (
        "main_quiz_id" BIGSERIAL NOT NULL,
        "difficulty_level" "public"."tb_main_quiz_difficulty_level_enum" NOT NULL,
        "title" character varying(255) NOT NULL,
        "content" character varying(255) NOT NULL,
        "hint" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "quiz_category_id" bigint NOT NULL,
        CONSTRAINT "PK_c032a6018114925564cf102a93e" PRIMARY KEY ("main_quiz_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."tb_solved_quiz_comprehension_level_enum" AS ENUM ('HIGH','NORMAL','LOW')`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."tb_solved_quiz_importance_enum" AS ENUM ('HIGH','NORMAL','LOW')`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_solved_quiz" (
        "solved_quiz_id" BIGSERIAL NOT NULL,
        "speech_text" text NOT NULL,
        "comprehension_level" "public"."tb_solved_quiz_comprehension_level_enum",
        "importance" "public"."tb_solved_quiz_importance_enum",
        "ai_feedback" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" bigint NOT NULL,
        "main_quiz_id" bigint NOT NULL,
        CONSTRAINT "PK_e7aefae4d483c2c9801627b270d" PRIMARY KEY ("solved_quiz_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."tb_user_provider_enum" AS ENUM ('KAKAO','NAVER','GOOGLE')`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_user" (
        "user_id" BIGSERIAL NOT NULL,
        "uuid" uuid NOT NULL,
        "username" character varying(255) NOT NULL,
        "level" character varying(255),
        "interest_area" character varying(255),
        "provider" "public"."tb_user_provider_enum",
        "provider_id" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by" bigint NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now(),
        "updated_by" bigint,
        CONSTRAINT "UQ_051c03233cac54bcc8ac5f1f75f" UNIQUE ("uuid"),
        CONSTRAINT "PK_42c03508ef5c980c06d42961b75" PRIMARY KEY ("user_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_multiple_choice" (
        "multiple_choice_id" BIGSERIAL NOT NULL,
        "content" character varying(255) NOT NULL,
        "main_quiz_id" bigint NOT NULL,
        CONSTRAINT "PK_f48c9108a641e1d19b35586cc0e" PRIMARY KEY ("multiple_choice_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_multiple_choice_option" (
        "multiple_quiz_option_id" BIGSERIAL NOT NULL,
        "option" character varying(255) NOT NULL,
        "is_correct" boolean NOT NULL,
        "explanation" text,
        "multiple_choice_id" bigint NOT NULL,
        CONSTRAINT "PK_958a69ed46d170ea8ffeb71a7aa" PRIMARY KEY ("multiple_quiz_option_id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "tb_flashcard" (
        "flashcard_id" BIGSERIAL NOT NULL,
        "content" character varying(255),
        "answer" character varying(255),
        "main_quiz_id" bigint NOT NULL,
        CONSTRAINT "PK_e352776f820d091162e2036b574" PRIMARY KEY ("flashcard_id")
      )`,
    );

    /* FK */
    await queryRunner.query(
      `ALTER TABLE "tb_checklist_item"
       ADD CONSTRAINT "FK_e67422b2cf43ca53b5192fd758d"
       FOREIGN KEY ("main_quiz_id") REFERENCES "tb_main_quiz"("main_quiz_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_quiz_keywords"
       ADD CONSTRAINT "FK_e12c6ca4d20663fdaab7fbf48be"
       FOREIGN KEY ("main_quiz_id") REFERENCES "tb_main_quiz"("main_quiz_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_main_quiz"
       ADD CONSTRAINT "FK_384a1268ca62dde7c0238b0607a"
       FOREIGN KEY ("quiz_category_id") REFERENCES "tb_quiz_category"("quiz_category_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz"
       ADD CONSTRAINT "FK_951f916e7067deb67b60887f5ae"
       FOREIGN KEY ("user_id") REFERENCES "tb_user"("user_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_solved_quiz"
       ADD CONSTRAINT "FK_690c25b5785f6028124e3a5cd69"
       FOREIGN KEY ("main_quiz_id") REFERENCES "tb_main_quiz"("main_quiz_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_multiple_choice"
       ADD CONSTRAINT "FK_cba22770fc46fadc9a11830879d"
       FOREIGN KEY ("main_quiz_id") REFERENCES "tb_main_quiz"("main_quiz_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_multiple_choice_option"
       ADD CONSTRAINT "FK_a5536ad920be7c98ba50a861870"
       FOREIGN KEY ("multiple_choice_id") REFERENCES "tb_multiple_choice"("multiple_choice_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_flashcard"
       ADD CONSTRAINT "FK_7ac602043b3ee709e08e3cd207f"
       FOREIGN KEY ("main_quiz_id") REFERENCES "tb_main_quiz"("main_quiz_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_user_checklist_progress"
       ADD CONSTRAINT "FK_63f7fb05d8cce69fce5d617e866"
       FOREIGN KEY ("user_id") REFERENCES "tb_user"("user_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_user_checklist_progress"
       ADD CONSTRAINT "FK_06e80791252603050d4fe5643c4"
       FOREIGN KEY ("checklist_item_id") REFERENCES "tb_checklist_item"("checklist_item_id")`,
    );

    await queryRunner.query(
      `ALTER TABLE "tb_user_checklist_progress"
       ADD CONSTRAINT "FK_f76c67a05a138f547c01967f22a"
       FOREIGN KEY ("solved_quiz_id") REFERENCES "tb_solved_quiz"("solved_quiz_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tb_user_checklist_progress"`);
    await queryRunner.query(`DROP TABLE "tb_flashcard"`);
    await queryRunner.query(`DROP TABLE "tb_multiple_choice_option"`);
    await queryRunner.query(`DROP TABLE "tb_multiple_choice"`);
    await queryRunner.query(`DROP TABLE "tb_solved_quiz"`);
    await queryRunner.query(`DROP TABLE "tb_user"`);
    await queryRunner.query(`DROP TABLE "tb_quiz_keywords"`);
    await queryRunner.query(`DROP TABLE "tb_checklist_item"`);
    await queryRunner.query(`DROP TABLE "tb_main_quiz"`);
    await queryRunner.query(`DROP TABLE "tb_quiz_category"`);
    await queryRunner.query(`DROP TYPE "public"."tb_user_provider_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."tb_solved_quiz_importance_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tb_solved_quiz_comprehension_level_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."tb_main_quiz_difficulty_level_enum"`,
    );
  }
}
