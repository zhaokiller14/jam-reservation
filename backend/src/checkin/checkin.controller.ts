import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { CheckinService } from './checkin.service';
import { StaffGuard } from '../common/guards/staff.guard';

class ScanDto {
  @IsNotEmpty()
    @IsString()
    reservationId!: string;
}

@Controller('checkin')
@UseGuards(StaffGuard)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post('scan')
  @HttpCode(HttpStatus.OK)
  async scan(@Body() body: ScanDto) {
    return this.checkinService.scan(body.reservationId);
  }
}