import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGuestProviderToUser1769507586000 implements MigrationInterface {
  name = 'AddGuestProviderToUser1769507586000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // GUEST 값을 tb_user_provider_enum에 추가
    await queryRunner.query(
      `ALTER TYPE "public"."tb_user_provider_enum" ADD VALUE 'GUEST'`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // PostgreSQL에서는 enum 값 제거가 복잡하므로 경고만 출력
    await Promise.resolve();
    console.warn(
      'Cannot automatically remove GUEST from tb_user_provider_enum. ' +
        'Manual cleanup required if rollback is necessary.',
    );
  }
}
