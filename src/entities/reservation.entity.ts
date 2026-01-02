import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Vehicules } from './vehicules.entity';
import { Payment } from './payment.entity';

export type ReservationStatus = 'PENDING' | 'APPROVED' | 'CANCELLED';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: ReservationStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  vehicleId: number;

  @ManyToOne(() => Vehicules, (vehicle) => vehicle.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicules;

  @OneToOne(() => Payment, (payment) => payment.reservation, {
    nullable: true,
  })
  payment: Payment;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
