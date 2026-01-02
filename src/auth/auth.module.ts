import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtServiceModule } from 'src/common/jwt-service/jwt-service.module';
import { HashingModule } from 'src/common/hashing/hashing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtServiceModule, HashingModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
