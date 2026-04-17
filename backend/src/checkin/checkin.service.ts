import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../reservations/entity/reservations.entity';

export type ScanResult =
  | { status: 'success'; fullName: string; university: string }
  | { 
    status: 'already_checked_in'; 
    fullName: string; 
    checkedInAt: Date | null 
}
  | { status: 'not_found' };

@Injectable()
export class CheckinService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  async scan(reservationId: string): Promise<ScanResult> {
    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      return { status: 'not_found' };
    }

    if (reservation.checkedIn) {
      return {
        status: 'already_checked_in',
        fullName: reservation.fullName,
        checkedInAt: reservation.checkedInAt,
      };
    }

    reservation.checkedIn = true;
    reservation.checkedInAt = new Date();
    await this.reservationRepo.save(reservation);

    return {
      status: 'success',
      fullName: reservation.fullName,
      university: reservation.university,
    };
  }
}