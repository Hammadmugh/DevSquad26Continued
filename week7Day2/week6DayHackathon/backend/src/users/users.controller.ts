import {
  Controller, Get, Patch, Param, Body, UseGuards, Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /api/users/me — current user's profile */
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.sub);
  }

  /** PATCH /api/users/me — update own profile */
  @Patch('me')
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    const { role, ...safe } = dto; // users cannot change their own role
    return this.usersService.update(user.sub, safe);
  }

  /** GET /api/users — list all users (Admin+) */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /** GET /api/users/:id — get any user (Admin+) */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /** PATCH /api/users/:id/role — change role (SuperAdmin only) */
  @UseGuards(RolesGuard)
  @Roles(Role.SuperAdmin)
  @Patch(':id/role')
  changeRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.changeRole(id, role);
  }
}
