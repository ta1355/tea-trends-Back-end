import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { JwtSecretServiceService } from './jwt-secret.service/jwt-secret.service.service';
import { AuthModuleModule } from './auth.module/auth.module.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootmysql',
      database: 'tea',
      entities: [User], // 여러 엔티티 배열로 전달
      synchronize: true, // 테이블 자동 생성
    }),
    AuthModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtSecretServiceService],
})
export class AppModule {}
