import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Vehicules } from 'src/entities/vehicules.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Vehicules, Reservation])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
