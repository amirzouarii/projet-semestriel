import { Request } from 'express';
import { TokenPayload } from '../jwt-service/jwt-service.service';

export interface RequestWithUser extends Request {
  user: TokenPayload;
}
