import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';
import { JwtServiceService } from 'src/common/jwt-service/jwt-service.service';
import { ResponseCodes } from 'src/common/utils/response-codes';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtServiceService,
    private readonly hashingService: HashingService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async loginUser(dto: { email: string; password: string }) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) {
      throw new BadRequestException({
        message: 'Invalid credentials',
        code: ResponseCodes.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({
        message: 'Invalid credentials',
        code: ResponseCodes.INVALID_CREDENTIALS,
      });
    }

    const token = this.jwtService.generateToken({
      userId: user.id,
      username: user.name,
      role: user.role,
    });

    return { token };
  }

  async registerUser(dto: { name: string; email: string; password: string }) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException({
        message: 'Email already in use',
        code: ResponseCodes.USER_ALREADY_EXISTS,
      });
    }

    const hashedPassword = await this.hashingService.hash(dto.password);
    const newUser = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: 'USER',
    });

    await this.userRepository.save(newUser);

    const token = this.jwtService.generateToken({
      userId: newUser.id,
      username: newUser.name,
      role: newUser.role,
    });

    return {
      message: 'User registered successfully',
      userId: newUser.id,
      token,
    };
  }
}
