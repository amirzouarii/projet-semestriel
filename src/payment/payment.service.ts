import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { CreatePaymentDto, CompletePaymentDto, PaymentQueryDto } from './dto/payment.dto';
import { TokenPayload } from 'src/common/jwt-service/jwt-service.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreatePaymentDto, currentUser: TokenPayload) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: dto.reservationId },
      relations: ['user'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Only allow users to pay for their own reservations or admins
    if (
      currentUser.role !== 'ADMIN' &&
      reservation.userId !== currentUser.userId
    ) {
      throw new BadRequestException('Cannot create payment for other users reservations');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentRepository.findOne({
      where: { reservationId: dto.reservationId },
    });

    if (existingPayment && existingPayment.status === 'COMPLETED') {
      throw new BadRequestException('Payment already completed for this reservation');
    }

    // Verify amount matches reservation total
    if (Number(dto.amount) !== Number(reservation.totalPrice)) {
      throw new BadRequestException(
        `Payment amount must match reservation total (${reservation.totalPrice})`,
      );
    }

    const payment = this.paymentRepository.create({
      ...dto,
      userId: currentUser.userId,
      status: 'PENDING',
      method: dto.method || 'CASH',
    });

    return this.paymentRepository.save(payment);
  }

  async complete(id: number, dto: CompletePaymentDto, currentUser: TokenPayload) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['reservation', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Only admins can mark payments as completed, or user can complete their own
    if (
      currentUser.role !== 'ADMIN' &&
      payment.userId !== currentUser.userId
    ) {
      throw new BadRequestException('Cannot mark other users payments as complete');
    }

    payment.status = 'COMPLETED';
    payment.paidAt = new Date();
    if (dto.notes) {
      payment.notes = dto.notes;
    }

    const updated = await this.paymentRepository.save(payment);

    // Auto-approve reservation when payment is completed
    const reservation = await this.reservationRepository.findOne({
      where: { id: payment.reservationId },
    });

    if (reservation && reservation.status === 'PENDING') {
      reservation.status = 'APPROVED';
      await this.reservationRepository.save(reservation);
    }

    return updated;
  }

  async fail(id: number, dto: CompletePaymentDto, currentUser: TokenPayload) {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      payment.userId !== currentUser.userId
    ) {
      throw new BadRequestException('Cannot mark other users payments as failed');
    }

    payment.status = 'FAILED';
    if (dto.notes) {
      payment.notes = dto.notes;
    }

    return this.paymentRepository.save(payment);
  }

  async list(query: PaymentQueryDto, currentUser: TokenPayload) {
    const { page, limit, status, reservationId } = query;
    const qb = this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.reservation', 'reservation')
      .leftJoinAndSelect('payment.user', 'user');

    // Users see only their payments
    if (currentUser.role !== 'ADMIN') {
      qb.andWhere('payment.userId = :userId', { userId: currentUser.userId });
    }

    if (status) {
      qb.andWhere('payment.status = :status', { status });
    }

    if (reservationId) {
      qb.andWhere('payment.reservationId = :reservationId', { reservationId });
    }

    qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('payment.createdAt', 'DESC');

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

  async findOne(id: number, currentUser: TokenPayload) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['reservation', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (
      currentUser.role !== 'ADMIN' &&
      payment.userId !== currentUser.userId
    ) {
      throw new BadRequestException('Cannot view other users payments');
    }

    return payment;
  }
}
