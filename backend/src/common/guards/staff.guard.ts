import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StaffGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const providedPassword = request.headers['x-staff-password'];
    const expectedPassword = this.config.get<string>('STAFF_PASSWORD');

    if (!providedPassword || providedPassword !== expectedPassword) {
      throw new UnauthorizedException('Invalid staff password.');
    }

    return true;
  }
}