import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private readonly logger = new Logger(JwtMiddleware.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return next();
      }

      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        return next();
      }

      // Verify and decode JWT
      const decoded = this.jwtService.verify(token);
      this.logger.debug(`[JWT Middleware] JWT decoded, user ID: ${decoded.sub}`);
      
      // Validate that the ID is a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(decoded.sub)) {
        this.logger.warn(`[JWT Middleware] Invalid ObjectId format: ${decoded.sub}`);
        return next();
      }
      
      // Fetch user from database using UserService
      try {
        const user = await this.userService.findOne(decoded.sub);
        if (user) {
          req.user = user;
          this.logger.debug(`[JWT Middleware] User authenticated: ${user.email} (ID: ${decoded.sub})`);
        }
      } catch (innerError) {
        this.logger.warn(`[JWT Middleware] User lookup failed for ID ${decoded.sub}: ${innerError.message}`);
        // Don't fail - just continue without attaching user to request
      }
    } catch (error) {
      // Log but don't throw - let the guard handle unauthorized access
      this.logger.debug(`[JWT Middleware] Token validation failed: ${error.message}`);
    }
    
    next();
  }
}
