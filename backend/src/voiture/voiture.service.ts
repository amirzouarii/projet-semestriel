import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicules } from 'src/entities/vehicules.entity';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleQueryDto,
} from './dto/vehicle.dto';

@Injectable()
export class VoitureService {
  constructor(
    @InjectRepository(Vehicules)
    private readonly voitureRepository: Repository<Vehicules>,
  ) {}

  async findAll(query: VehicleQueryDto) {
    const {
      page,
      limit,
      search,
      etat,
      marque,
      carburant,
      transmission,
      minPlaces,
      minPrice,
      maxPrice,
    } = query;
    const qb = this.voitureRepository.createQueryBuilder('vehicle');

    if (search) {
      qb.andWhere(
        '(LOWER(vehicle.marque) LIKE :search OR LOWER(vehicle.modele) LIKE :search)',
        {
          search: `%${search.toLowerCase()}%`,
        },
      );
    }

    if (etat) {
      qb.andWhere('vehicle.etat = :etat', { etat });
    }

    if (marque) {
      qb.andWhere('vehicle.marque = :marque', { marque });
    }

    if (carburant) {
      qb.andWhere('vehicle.carburant = :carburant', { carburant });
    }

    if (transmission) {
      qb.andWhere('vehicle.transmission = :transmission', { transmission });
    }

    if (minPlaces !== undefined) {
      qb.andWhere('vehicle.places >= :minPlaces', { minPlaces });
    }

    if (minPrice !== undefined) {
      qb.andWhere('vehicle.prixJour >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('vehicle.prixJour <= :maxPrice', { maxPrice });
    }

    qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vehicle.createdAt', 'DESC');

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

  async getAllMarques() {
    const marques = await this.voitureRepository
      .createQueryBuilder('vehicle')
      .select('DISTINCT vehicle.marque', 'marque')
      .orderBy('vehicle.marque', 'ASC')
      .getRawMany();

    return marques.map((item) => item.marque);
  }

  async getAllCarburants() {
    const carburants = await this.voitureRepository
      .createQueryBuilder('vehicle')
      .select('DISTINCT vehicle.carburant', 'carburant')
      .where('vehicle.carburant IS NOT NULL')
      .orderBy('vehicle.carburant', 'ASC')
      .getRawMany();

    return carburants.map((item) => item.carburant);
  }

  async getAllTransmissions() {
    const transmissions = await this.voitureRepository
      .createQueryBuilder('vehicle')
      .select('DISTINCT vehicle.transmission', 'transmission')
      .where('vehicle.transmission IS NOT NULL')
      .orderBy('vehicle.transmission', 'ASC')
      .getRawMany();

    return transmissions.map((item) => item.transmission);
  }

  async findOne(id: number) {
    const vehicle = await this.voitureRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  async create(dto: CreateVehicleDto) {
    const existing = await this.voitureRepository.findOne({
      where: { immatriculation: dto.immatriculation },
    });

    if (existing) {
      throw new BadRequestException('Registration number already used');
    }

    const vehicle = this.voitureRepository.create(dto);
    return this.voitureRepository.save(vehicle);
  }

  async update(id: number, dto: UpdateVehicleDto) {
    if (dto.immatriculation) {
      const duplicate = await this.voitureRepository.findOne({
        where: { immatriculation: dto.immatriculation },
      });

      if (duplicate && duplicate.id !== id) {
        throw new BadRequestException('Registration number already used');
      }
    }

    const vehicle = await this.voitureRepository.preload({ id, ...dto });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return this.voitureRepository.save(vehicle);
  }

  async delete(id: number) {
    const result = await this.voitureRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Vehicle not found');
    }
  }
}
