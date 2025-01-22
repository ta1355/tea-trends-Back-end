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

@Entity('user') // user 테이블 정의
export class User {
  @PrimaryGeneratedColumn()
  indexId: number; // 기본키, 사용자 고유 ID

  @Column({ unique: true })
  @IsNotEmpty()
  username: string; // 사용자 이름

  @Column()
  @IsNotEmpty()
  @Length(6, 20) // 비밀번호 길이 제약
  userPassword: string; // 사용자 비밀번호

  @Column({ unique: true })
  @IsEmail() // 이메일 형식 검증
  userEmail: string; // 사용자 이메일

  @Column({ default: 'USER' }) // 기본 역할은 'USER'로 설정
  role: string; // 사용자 역할 (예: 'USER', 'ADMIN', 'MODERATOR')

  @CreateDateColumn()
  createDateTime: Date; // 계정 생성 시간 자동 기록

  @DeleteDateColumn({ nullable: true })
  deletedDateTime: Date | null; // 계정 삭제 시간 (소프트 삭제)

  @BeforeInsert()
  async hashPassword() {
    if (this.userPassword) {
      this.userPassword = await bcrypt.hash(this.userPassword, 10); // 비밀번호 해싱
    }
  }

  // 비밀번호 검증 (로그인 시 입력된 비밀번호와 저장된 비밀번호 비교)
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.userPassword); // 비밀번호 비교
  }

  // 소프트 삭제 메서드
  softDelete() {
    this.deletedDateTime = new Date(); // 삭제 시간을 현재 시간으로 설정
  }

  // 삭제 여부 확인 메서드
  isDeleted(): boolean {
    return this.deletedDateTime !== null;
  }

  // 사용자 활성화 여부 확인 메서드
  isActive(): boolean {
    return this.deletedDateTime === null; // 삭제되지 않은 사용자만 활성화된 사용자로 간주
  }
}
