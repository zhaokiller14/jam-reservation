import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { Reservation } from './entity/reservations.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ResendTicketDto } from './dto/resend-ticket.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    // Check for duplicate email
    const existing = await this.reservationRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException(
        'A reservation with this email already exists.',
      );
    }

    const reservation = this.reservationRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      university: dto.university,
    });

    const saved = await this.reservationRepo.save(reservation);

    // Generate QR code as base64 data URL
    const qrCodeDataUrl = await QRCode.toDataURL(saved.id, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    // Send confirmation email (non-blocking)
    this.mailService
      .sendTicket(saved, qrCodeDataUrl)
      .catch((err) => console.error('Mail send failed:', err));

    return saved;
  }

  async resend(dto: ResendTicketDto): Promise<void> {
    const reservation = await this.reservationRepo.findOne({
      where: { email: dto.email },
    });

    if (!reservation) {
      // Return silently to avoid email enumeration
      return;
    }

    const qrCodeDataUrl = await QRCode.toDataURL(reservation.id, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    await this.mailService.sendTicket(reservation, qrCodeDataUrl);
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservationRepo.findOne({ where: { id } });
  }
}