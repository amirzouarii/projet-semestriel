import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Maintenance } from './maintenance.entity';

@Entity()
export class Vehicules {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  marque: string;

  @Column({ type: 'varchar', length: 100 })
  modele: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  immatriculation: string;

  @Column({ type: 'varchar', length: 50 })
  etat: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  prixJour: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'int', nullable: true })
  annee: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  couleur: string;

  @Column({ type: 'int', nullable: true })
  kilometrage: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  carburant: string; // essence, diesel, électrique, hybride

  @Column({ type: 'varchar', length: 50, nullable: true })
  transmission: string; // manuelle, automatique

  @Column({ type: 'int', nullable: true })
  places: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Reservation, (reservation) => reservation.vehicle)
  reservations: Reservation[];

  @OneToMany(() => Maintenance, (maintenance) => maintenance.vehicle)
  maintenances: Maintenance[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
