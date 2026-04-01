import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Auth()
  findAll(@CurrentUser() user: User) {
    return this.notificationService.findAll(user._id.toString());
  }

  @Get('unread')
  @Auth()
  findUnread(@CurrentUser() user: User) {
    return this.notificationService.findUnread(user._id.toString());
  }

  @Get('unread-count')
  @Auth()
  getUnreadCount(@CurrentUser() user: User) {
    return this.notificationService.getUnreadCount(user._id.toString());
  }

  @Patch('mark-all-read')
  @Auth()
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationService.markAllAsRead(user._id.toString());
  }

  @Patch(':id')
  @Auth()
  markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationService.markAsRead(id, user._id.toString());
  }

  @Delete(':id')
  @Auth()
  delete(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationService.delete(id, user._id.toString());
  }

  @Delete()
  @Auth()
  deleteAll(@CurrentUser() user: User) {
    return this.notificationService.deleteAll(user._id.toString());
  }
}
