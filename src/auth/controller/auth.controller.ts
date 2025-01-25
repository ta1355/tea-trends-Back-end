import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface JwtPayload {
  indexId: number;
  userEmail: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: Omit<User, 'userPassword'> }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: JwtPayload }): JwtPayload {
    return req.user;
  }
}
