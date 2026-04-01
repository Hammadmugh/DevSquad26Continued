import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @Auth()
  getProfile(@CurrentUser() user: User) {
    return this.userService.getProfile(user._id.toString());
  }

  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    // Ensure user can only update their own profile
    if (user._id.toString() !== id) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.userService.update(id, updateUserDto);
  }
}
