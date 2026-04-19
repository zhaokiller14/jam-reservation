import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { CheckinModule } from './checkin/checkin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MailModule } from './mail/mail.module';
import { Reservation } from './reservations/entity/reservations.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbSsl = (config.get<string>('DB_SSL') || 'false').toLowerCase() === 'true';

        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          entities: [Reservation],
          synchronize: true, // set to false in production, use migrations
          ssl: dbSsl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ReservationsModule,
    CheckinModule,
    DashboardModule,
    MailModule,
  ],
})
export class AppModule {}