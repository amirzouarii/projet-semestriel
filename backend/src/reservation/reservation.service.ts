import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from 'src/entities/reservation.entity';
import { Vehicules } from 'src/entities/vehicules.entity';
import { User } from 'src/entities/user.entity';
import {
  CreateReservationDto,
  ReservationQueryDto,
  UpdateReservationStatusDto,
} from './dto/reservation.dto';
import { TokenPayload } from 'src/common/jwt-service/jwt-service.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Vehicules)
    private readonly vehicleRepository: Repository<Vehicules>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private assertDateRange(startDate: Date, endDate: Date) {
    if (startDate >= endDate) {
      throw new BadRequestException('startDate must be before endDate');
    }
  }

  private computePrice(startDate: Date, endDate: Date, dailyRate: number) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / msPerDay,
    );

    if (durationDays <= 0) {
      throw new BadRequestException('Reservation duration must be positive');
    }

    return durationDays * Number(dailyRate);
  }

  async create(dto: CreateReservationDto, currentUser: TokenPayload) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    this.assertDateRange(startDate, endDate);

    const targetUserId = dto.userId ?? currentUser.userId;

    if (currentUser.role !== 'ADMIN' && targetUserId !== currentUser.userId) {
      throw new ForbiddenException('Cannot create reservations for other users');
    }

    const [vehicle, user] = await Promise.all([
      this.vehicleRepository.findOne({ where: { id: dto.vehicleId } }),
      this.userRepository.findOne({ where: { id: targetUserId } }),
    ]);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const conflictCount = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.vehicleId = :vehicleId', { vehicleId: dto.vehicleId })
      .andWhere('reservation.status IN (:...statuses)', {
        statuses: ['PENDING', 'APPROVED'],
      })
      .andWhere('reservation.startDate < :endDate', { endDate })
      .andWhere('reservation.endDate > :startDate', { startDate })
      .getCount();

    if (conflictCount > 0) {
      throw new BadRequestException(
        'Vehicle already reserved for the selected date range',
      );
    }

    const totalPrice = this.computePrice(startDate, endDate, Number(vehicle.prixJour));

    const reservation = this.reservationRepository.create({
      ...dto,
      userId: targetUserId,
      totalPrice,
      status: 'PENDING',
    });

    return this.reservationRepository.save(reservation);
  }

  async list(query: ReservationQueryDto, currentUser: TokenPayload) {
    const { page, limit, status } = query;
    const qb = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.vehicle', 'vehicle')
      .leftJoinAndSelect('reservation.user', 'user');

    if (currentUser.role !== 'ADMIN') {
      qb.andWhere('reservation.userId = :userId', { userId: currentUser.userId });
    }

    if (status) {
      qb.andWhere('reservation.status = :status', { status });
    }

    qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('reservation.startDate', 'DESC');

    const [data, total] = await qb.getManyAndCount();

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

  async updateStatus(
    id: number,
    dto: UpdateReservationStatusDto,
  ) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    reservation.status = dto.status as ReservationStatus;

    // If reservation is approved by admin, mark the associated vehicle as "Loué"
    if ((dto.status ?? '').toUpperCase() === 'APPROVED') {
      try {
        const vehicle = await this.vehicleRepository.findOne({ where: { id: reservation.vehicleId } });
        if (vehicle) {
          vehicle.etat = 'Loué';
          await this.vehicleRepository.save(vehicle);
        }
      } catch (err) {
        // Log and continue - reservation status should still be updated
        console.error('Failed to update vehicle status when approving reservation', err);
      }
    }

    return this.reservationRepository.save(reservation);
  }

  async cancel(id: number, currentUser: TokenPayload) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      reservation.userId !== currentUser.userId
    ) {
      throw new ForbiddenException('Cannot cancel other users reservations');
    }

    reservation.status = 'CANCELLED';
    return this.reservationRepository.save(reservation);
  }
}
