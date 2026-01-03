import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { Vehicules } from 'src/entities/vehicules.entity';
import { Reservation } from 'src/entities/reservation.entity';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewQueryDto,
} from './dto/review.dto';
import { TokenPayload } from 'src/common/jwt-service/jwt-service.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Vehicules)
    private readonly vehicleRepository: Repository<Vehicules>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreateReviewDto, currentUser: TokenPayload) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (dto.reservationId) {
      const reservation = await this.reservationRepository.findOne({
        where: { id: dto.reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (
        currentUser.role !== 'ADMIN' &&
        reservation.userId !== currentUser.userId
      ) {
        throw new BadRequestException(
          'Cannot review based on other users reservations',
        );
      }
    }

    // Check if user already reviewed this vehicle
    const existingReview = await this.reviewRepository.findOne({
      where: {
        userId: currentUser.userId,
        vehicleId: dto.vehicleId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this vehicle');
    }

    const review = this.reviewRepository.create({
      ...dto,
      userId: currentUser.userId,
      verified: false,
    });

    return this.reviewRepository.save(review);
  }

  async list(query: ReviewQueryDto) {
    const { page, limit, vehicleId, minRating, maxRating, verified } = query;
    const qb = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.vehicle', 'vehicle');

    if (vehicleId) {
      qb.andWhere('review.vehicleId = :vehicleId', { vehicleId });
    }

    if (minRating !== undefined) {
      qb.andWhere('review.rating >= :minRating', { minRating });
    }

    if (maxRating !== undefined) {
      qb.andWhere('review.rating <= :maxRating', { maxRating });
    }

    if (verified !== undefined) {
      qb.andWhere('review.verified = :verified', { verified });
    }

    qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('review.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        averageRating:
          total > 0
            ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(
                2,
              )
            : 0,
      },
    };
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: number, dto: UpdateReviewDto, currentUser: TokenPayload) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      review.userId !== currentUser.userId
    ) {
      throw new BadRequestException('Cannot update other users reviews');
    }

    if (dto.rating !== undefined) {
      review.rating = dto.rating;
    }

    if (dto.comment !== undefined) {
      review.comment = dto.comment;
    }

    return this.reviewRepository.save(review);
  }

  async delete(id: number, currentUser: TokenPayload) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      review.userId !== currentUser.userId
    ) {
      throw new BadRequestException('Cannot delete other users reviews');
    }

    await this.reviewRepository.delete(id);
  }

  async verify(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.verified = true;
    return this.reviewRepository.save(review);
  }

  async getVehicleAverageRating(vehicleId: number) {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.vehicleId = :vehicleId', { vehicleId })
      .andWhere('review.verified = :verified', { verified: true })
      .getRawOne();

    return {
      vehicleId,
      averageRating: result.average ? parseFloat(result.average).toFixed(2) : 0,
      reviewCount: parseInt(result.count) || 0,
    };
  }
}
