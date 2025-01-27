import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import * as bcrypt from 'bcryptjs'; // bcrypt를 사용하여 비밀번호 암호화

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  indexId: number; // 기본키, 사용자 고유 ID

  @Column({ unique: true })
  @IsNotEmpty()
  userName: string;

  @Column()
  @IsNotEmpty()
  @Length(6, 20)
  userPassword: string;

  @Column({ unique: true })
  @IsEmail()
  userEmail: string;

  @Column({ default: 'USER' })
  role: string;

  @CreateDateColumn()
  createDateTime: Date;

  @DeleteDateColumn({ nullable: true })
  deletedDateTime: Date | null;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.userPassword) {
      this.userPassword = await bcrypt.hash(this.userPassword, 10); // 비밀번호 해싱
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.userPassword); // 비밀번호 비교
  }

  softDelete() {
    this.deletedDateTime = new Date();
  }

  isDeleted(): boolean {
    return this.deletedDateTime !== null;
  }

  isActive(): boolean {
    return this.deletedDateTime === null;
  }
}
