import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth.service';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { User } from 'src/auth/entity/user.entity';

type SafeUser = Omit<
  User,
  | 'userPassword'
  | 'hashPassword'
  | 'validatePassword'
  | 'softDelete'
  | 'isDeleted'
  | 'isActive'
>;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    //임시
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: 'userEmail',
      passwordField: 'userPassword',
    });
  }

  async validate(userEmail: string, userPassword: string): Promise<SafeUser> {
    const loginUserDto: LoginUserDto = { userEmail, userPassword };
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
