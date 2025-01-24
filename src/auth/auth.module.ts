import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtSecretService } from './jwt/jwt-secret.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (jwtSecretService: JwtSecretService) => ({
        secret: jwtSecretService.getSecretKey(),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [JwtSecretService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtSecretService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
