import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Simple JWT Auth Guard that checks if req.user was set by JwtMiddleware
 * This guard is used in conjunction with JwtMiddleware for proper auth flow
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new UnauthorizedException('Invalid or missing JWT token');
    }
    
    return true;
  }
}
