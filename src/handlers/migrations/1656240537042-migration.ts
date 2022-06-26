import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1656240537042 implements MigrationInterface {
    name = 'migration1656240537042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "examples" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "examples" DROP COLUMN "age"`);
    }

}
