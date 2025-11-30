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

  // Mettre à jour une voiture
  async update(voitureData: Partial<Vehicules>): Promise<Vehicules> {
  if (!voitureData.id) throw new Error('ID manquant');

  await this.voitureRepository.update(voitureData.id, voitureData);

  const updated = await this.voitureRepository.findOneBy({ id: voitureData.id });
  if (!updated) throw new Error('Voiture non trouvée');

  return updated;
}

async delete(id: number): Promise<void> {
  const result = await this.voitureRepository.delete(id);
  if (result.affected === 0) {
    throw new Error(`Voiture avec id ${id} non trouvée`);
  }
}



}
