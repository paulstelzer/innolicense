import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 100, nullable: true, name: 'password' })
  password: string | undefined;

  @Column()
  language: string;

  @Column({ length: 100, nullable: true })
  name: string | undefined;

  @Column({ default: false })
  verified: boolean;

  @Column("simple-array")
  roles: string[];

  constructor(email, pw, language = 'de') {
    super();
    this.email = email;
    this.password = pw;
    this.language = language;
  }
}

export interface UserMail {
  email: string;
  name: string;
  verified: boolean;
  notify: boolean;
}