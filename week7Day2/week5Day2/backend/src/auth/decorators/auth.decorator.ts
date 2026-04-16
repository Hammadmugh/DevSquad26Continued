import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * @Auth() - Composite decorator for protecting routes with JWT authentication
 * 
 * Usage:
 * @Auth()
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) { ... }
 */
export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
