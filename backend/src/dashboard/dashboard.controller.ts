import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { StaffGuard } from '../common/guards/staff.guard';

@Controller('dashboard')
@UseGuards(StaffGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('reservations')
  getReservations() {
    return this.dashboardService.getReservations();
  }
}