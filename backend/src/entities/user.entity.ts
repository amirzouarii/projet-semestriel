import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

export type UserRole = 'ADMIN' | 'USER';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  firstName: string;

  @Column({ type: 'varchar', length: 150 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', length: 10, default: 'USER' })
  role: UserRole;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
