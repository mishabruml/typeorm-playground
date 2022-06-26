import { MigrationInterface, QueryRunner } from "typeorm";

export class migrate1656246519490 implements MigrationInterface {
    name = 'migrate1656246519490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "examples" ADD "isMale" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "examples" DROP COLUMN "isMale"`);
    }

}
