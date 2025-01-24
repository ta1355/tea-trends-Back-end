import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userEmail',
      passwordField: 'userPassword',
    } as IStrategyOptions);
  }

  async validate(
    userEmail: string,
    userPassword: string,
  ): Promise<Omit<User, 'userPassword'>> {
    const loginUserDto: LoginUserDto = { userEmail, userPassword };
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    // 비밀번호 필드를 제외한 사용자 정보를 반환
    const { userPassword: _, ...result } = user;
    return result;
  }
}
