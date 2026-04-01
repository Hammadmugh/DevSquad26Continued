import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('User') private userModel: Model<Document>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret-key',
    });
    console.log('[JwtStrategy] Initialized with secret:', process.env.JWT_SECRET ? 'from .env' : 'default');
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] Validating payload:', payload.sub, payload.email);
    const user = await this.userModel.findById(payload.sub);
    console.log('[JwtStrategy] User found:', user ? 'Yes' : 'No');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
