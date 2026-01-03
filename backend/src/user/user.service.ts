import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = this.usersRepository.create({
      ...data,
      password: hashed,
    });

    return this.usersRepository.save(user);
  }

  async findProfile(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(query: PaginationQueryDto) {
    const { page, limit } = query;
    const [data, total] = await this.usersRepository.findAndCount({
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'createdAt',
        'updatedAt',
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
