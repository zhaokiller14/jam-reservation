import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    fullName!: string;

  @IsEmail()
    email!: string;

  @IsNotEmpty()
    @IsString()
    @MaxLength(150)
    university!: string;
}