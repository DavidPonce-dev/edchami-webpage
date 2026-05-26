import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 30, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profilePicture!: string;

  @Column({ type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 20, default: "reader" })
  role!: "reader" | "editor" | "admin";

  @Column({ type: "varchar", length: 255, nullable: true })
  refreshTokenHash!: string;

  @Column({ type: "boolean", default: false })
  isActive!: boolean;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
