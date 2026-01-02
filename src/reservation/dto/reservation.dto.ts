import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import type { ReservationStatus } from 'src/entities/reservation.entity';

export class CreateReservationDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;
}

export class ReservationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'CANCELLED'])
  status?: ReservationStatus;
}

export class UpdateReservationStatusDto {
  @IsEnum(['PENDING', 'APPROVED', 'CANCELLED'])
  status: ReservationStatus;
}
