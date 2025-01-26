import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  indexId: number;
  useremail: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Bearer Token에서 JWT 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰 거부
      ignoreExpiration: false,
      // 환경 변수에서 secret을 가져오되, 없으면 기본값 사용
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
