import { Module } from '@nestjs/common';
import { UsersService } from './user.service';

import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
   imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UserController]
})
export class UserModule {}
