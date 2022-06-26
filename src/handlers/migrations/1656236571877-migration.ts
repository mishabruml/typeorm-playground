import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1656236571877 implements MigrationInterface {
    name = 'migration1656236571877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "examples" ("name" text NOT NULL, CONSTRAINT "PK_69ac614b10e61a759ec83cbef77" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "examples_pkey" ON "examples" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."examples_pkey"`);
        await queryRunner.query(`DROP TABLE "examples"`);
    }

}
