import { IsEmail } from 'class-validator';

export class ResendTicketDto {
  @IsEmail()
    email!: string;
}