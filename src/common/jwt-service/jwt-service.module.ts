import { Module } from '@nestjs/common';
import { JwtServiceService } from './jwt-service.service';

@Module({
  providers: [JwtServiceService],
  exports: [JwtServiceService],
})
export class JwtServiceModule {}
