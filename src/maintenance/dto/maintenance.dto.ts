import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class CreateMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  cost: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId: number;
}

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {}

export class MaintenanceQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId?: number;
}
