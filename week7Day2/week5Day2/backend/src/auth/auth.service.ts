import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { email, password, username } = createAuthDto;
    this.logger.log(`📝 Registration attempt: ${username} (${email})`);

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      this.logger.warn(`⚠ Registration failed: Email or username already exists`);
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      username,
      followers: [],
      following: [],
    });

    this.logger.log(`✅ User created successfully: ${user._id}`);

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(email: string, password: string) {
    this.logger.log(`🔐 Login attempt: ${email}`);
    
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.warn(`⚠ Login failed: User not found - ${email}`);
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`⚠ Login failed: Invalid password - ${email}`);
      throw new BadRequestException('Invalid email or password');
    }

    this.logger.log(`✅ Login successful: ${email} (ID: ${user._id})`);

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
      },
    };
  }

  async validateUser(userId: string) {
    return this.userModel.findById(userId);
  }
}
