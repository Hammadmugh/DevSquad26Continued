import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({ ...dto, password: hashed });
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { access_token: token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.password) {
      throw new UnauthorizedException(
        `This account uses ${user.provider} login. Please sign in with ${user.provider}.`,
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.usersService.updateLastLogin(user._id.toString(), 'local');
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { access_token: token, user };
  }

  /** Called by OAuth strategies after provider validates the user */
  async validateOAuthUser(data: {
    providerId: string;
    provider: string;
    email: string;
    name: string;
    avatar?: string;
  }) {
    return this.usersService.findOrCreateOAuthUser(data);
  }

  /** Issues a JWT for an OAuth-authenticated user */
  async oauthLogin(result: { user: any; isNew: boolean }) {
    const { user, isNew } = result;
    await this.usersService.updateLastLogin(
      user._id.toString(),
      user.provider ?? 'oauth',
    );
    const token = this.jwtService.sign({ sub: user._id, role: user.role });
    return { access_token: token, user, isNew };
  }
}

