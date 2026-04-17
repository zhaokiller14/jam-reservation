import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ResendTicketDto } from './dto/resend-ticket.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    const reservation = await this.reservationsService.findById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }

    return {
      id: reservation.id,
      fullName: reservation.fullName,
      email: reservation.email,
      university: reservation.university,
      checkedIn: reservation.checkedIn,
      checkedInAt: reservation.checkedInAt,
      createdAt: reservation.createdAt,
    };
  }

  @Post()
  async create(@Body() dto: CreateReservationDto) {
    const reservation = await this.reservationsService.create(dto);
    return {
      id: reservation.id,
      fullName: reservation.fullName,
      email: reservation.email,
      university: reservation.university,
      createdAt: reservation.createdAt,
    };
  }

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(@Body() dto: ResendTicketDto) {
    await this.reservationsService.resend(dto);
    // Always return success to avoid email enumeration
    return { message: 'If this email is registered, a ticket has been sent.' };
  }
}