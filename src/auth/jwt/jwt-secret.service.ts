import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class JwtSecretService {
  constructor(private configService: ConfigService) {}

  generateSecretKey(): string {
    const randomBytes = crypto.randomBytes(32);
    return randomBytes.toString('base64');
  }

  getSecretKey(): string {
    let secretKey = this.configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      secretKey = this.generateSecretKey();
      console.log(`생성된 비밀키 : ${secretKey}`); //이거 태스트용도 배포시에는 꼭 지워야함 안지우면 망함
    }
    return secretKey;
  }
}
