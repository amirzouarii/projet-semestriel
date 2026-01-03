import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from 'jsonwebtoken';

export type TokenPayload = JwtPayload & {
  userId: number;
  username: string;
  role: string;
};

@Injectable()
export class JwtServiceService {
  constructor(private configService: ConfigService) {}

  // check if the token is valid
  verifyToken(token: string): TokenPayload {
    const secretKey =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
    return jwt.verify(token, secretKey) as TokenPayload;
  }

  // generate a token
  generateToken(payload: TokenPayload): string {
    const secretKey =
      this.configService.get<string>('JWT_SECRET') || 'default-secret';
    return jwt.sign(payload, secretKey);
  }
}
