import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtSecretService } from '../jwt/jwt-secret.service';
import { StrategyOptions } from 'passport-jwt';
interface JwtPayload {
  sub: number;
  userEmail: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtSecretService: JwtSecretService) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecretService.getSecretKey(),
    };
    super(options);
  }

  async validate(
    payload: JwtPayload,
  ): Promise<{ userId: number; userEmail: string }> {
    return { userId: payload.sub, userEmail: payload.userEmail };
  }
}
