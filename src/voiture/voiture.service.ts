// src/voiture/voiture.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicules } from 'src/entities/user/vehicules.entity';
import { Repository } from 'typeorm';


@Injectable()
export class VoitureService {
  constructor(
    @InjectRepository(Vehicules)
    private voitureRepository: Repository<Vehicules>,
  ) {}

  // Récupérer toutes les voitures
  findAll(): Promise<Vehicules[]> {
    return this.voitureRepository.find();
  }

  // Ajouter une voiture
  create(voitureData: Partial<Vehicules>): Promise<Vehicules> {
    const voiture = this.voitureRepository.create(voitureData);
    return this.voitureRepository.save(voiture);
  }
}
