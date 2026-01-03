import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Maintenance } from 'src/entities/maintenance.entity';
import { Vehicules } from 'src/entities/vehicules.entity';
import {
  CreateMaintenanceDto,
  MaintenanceQueryDto,
  UpdateMaintenanceDto,
} from './dto/maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,
    @InjectRepository(Vehicules)
    private readonly vehicleRepository: Repository<Vehicules>,
  ) {}

  async create(dto: CreateMaintenanceDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: dto.vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const maintenance = this.maintenanceRepository.create(dto);
    return this.maintenanceRepository.save(maintenance);
  }

  async list(query: MaintenanceQueryDto) {
    const { page, limit, vehicleId } = query;
    const qb = this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .leftJoinAndSelect('maintenance.vehicle', 'vehicle');

    if (vehicleId) {
      qb.andWhere('maintenance.vehicleId = :vehicleId', { vehicleId });
    }

    qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('maintenance.date', 'DESC');

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

  async update(id: number, dto: UpdateMaintenanceDto) {
    const maintenance = await this.maintenanceRepository.preload({ id, ...dto });

    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found');
    }

    return this.maintenanceRepository.save(maintenance);
  }

  async delete(id: number) {
    const result = await this.maintenanceRepository.delete(id);

    if (!result.affected) {
      throw new BadRequestException('Maintenance record not found');
    }
  }
}
