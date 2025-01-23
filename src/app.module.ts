import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { User } from './user/user.entity';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
