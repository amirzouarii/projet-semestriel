import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  marque: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  modele: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  immatriculation: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  etat: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  prixJour: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  annee?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  couleur?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  kilometrage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  carburant?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  transmission?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  places?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateVehicleDto extends PartialType(
  OmitType(CreateVehicleDto, ['immatriculation'] as const),
) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  immatriculation?: string;
}

export class VehicleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  etat?: string;

  @IsOptional()
  @IsString()
  marque?: string;

  @IsOptional()
  @IsString()
  carburant?: string;

  @IsOptional()
  @IsString()
  transmission?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minPlaces?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
