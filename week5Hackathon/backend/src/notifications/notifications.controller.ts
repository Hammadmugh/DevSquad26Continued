import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getAll(@Request() req: AuthRequest) {
    return this.notificationsService.getForUser(req.user.userId);
  }

  @Patch('read-all')
  markAllRead(@Request() req: AuthRequest) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  @Delete()
  clearAll(@Request() req: AuthRequest) {
    return this.notificationsService.deleteAll(req.user.userId);
  }
}
