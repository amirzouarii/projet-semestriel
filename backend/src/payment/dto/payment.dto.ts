import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import type { PaymentMethod, PaymentStatus } from 'src/entities/payment.entity';

export class CreatePaymentDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  reservationId: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsEnum(['CASH', 'CARD', 'BANK_TRANSFER'])
  method?: PaymentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class CompletePaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class PaymentQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FAILED'])
  status?: PaymentStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  reservationId?: number;
}
