import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column({ name: 'full_name' })
    fullName!: string;

  @Column({ unique: true })
    email!: string;

  @Column()
    university!: string;

  @Column({ name: 'checked_in', default: false })
    checkedIn!: boolean;

  @Column({ name: 'checked_in_at', nullable: true, type: 'timestamptz' })
    checkedInAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}