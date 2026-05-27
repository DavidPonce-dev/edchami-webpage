import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1716652800000 implements MigrationInterface {
  name = "InitialSchema1716652800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying(255) NOT NULL,
        "username" character varying(30) NOT NULL,
        "profilePicture" character varying(255),
        "passwordHash" character varying(255) NOT NULL,
        "role" character varying(20) NOT NULL DEFAULT 'reader',
        "refreshTokenHash" character varying(255),
        "isActive" boolean NOT NULL DEFAULT false,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "UQ_user_username" UNIQUE ("username"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "project" (
        "id" SERIAL NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "url" character varying(255),
        "imageUrl" character varying(255),
        "tags" jsonb NOT NULL DEFAULT '[]',
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
