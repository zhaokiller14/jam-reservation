import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../reservations/entity/reservations.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  async getStats() {
    const totalReservations = await this.reservationRepo.count();
    const totalCheckedIn = await this.reservationRepo.count({
      where: { checkedIn: true },
    });

    return {
      totalReservations,
      totalCheckedIn,
      remaining: totalReservations - totalCheckedIn,
    };
  }

  async getReservations() {
    return this.reservationRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
}