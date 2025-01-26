import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

// User에서 비밀번호와 메서드를 제외한 타입 정의
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
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, userPassword, userEmail, role } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { userEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const user = this.usersRepository.create({
      username,
      userPassword,
      userEmail,
      role,
    });

    return await this.usersRepository.save(user);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<SafeUser> {
    const { userEmail, userPassword } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { userEmail } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await user.validatePassword(userPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const safeUser: SafeUser = {
      indexId: user.indexId,
      username: user.username,
      userEmail: user.userEmail,
      role: user.role,
      createDateTime: user.createDateTime,
      deletedDateTime: user.deletedDateTime,
    };
    return safeUser;
  }

  login(user: SafeUser): { access_token: string } {
    const payload = { userEmail: user.userEmail, sub: user.indexId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
