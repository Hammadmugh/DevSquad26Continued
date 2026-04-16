import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async addPoints(id: string, points: number): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { $inc: { loyaltyPoints: points } }, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async deductPoints(id: string, points: number): Promise<UserDocument> {
    const user = await this.findById(id);
    if (user.loyaltyPoints < points)
      throw new BadRequestException('Insufficient loyalty points');
    return this.userModel
      .findByIdAndUpdate(id, { $inc: { loyaltyPoints: -points } }, { new: true })
      .exec() as Promise<UserDocument>;
  }

  async changeRole(id: string, role: Role): Promise<UserDocument> {
    return this.update(id, { role });
  }

  async updateLastLogin(id: string, method: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      lastLoginAt: new Date(),
      lastLoginMethod: method,
    });
  }

  /**
   * Find or create a user from an OAuth provider.
   * Supports account linking: if a user with the same email already exists,
   * their OAuth provider info is attached to that account.
   */
  async findOrCreateOAuthUser(data: {
    providerId: string;
    provider: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<{ user: UserDocument; isNew: boolean }> {
    // 1. Find by provider + providerId
    let user = await this.userModel
      .findOne({ provider: data.provider, providerId: data.providerId })
      .exec();
    if (user) return { user, isNew: false };

    // 2. Find by email (account linking — same email, different provider)
    user = await this.userModel
      .findOne({ email: data.email.toLowerCase() })
      .exec();
    if (user) {
      user.provider = data.provider;
      user.providerId = data.providerId;
      if (data.avatar && !user.avatar) user.avatar = data.avatar;
      await user.save();
      return { user, isNew: false };
    }

    // 3. Create new user
    const created = await this.userModel.create({
      name: data.name,
      email: data.email.toLowerCase(),
      provider: data.provider,
      providerId: data.providerId,
      avatar: data.avatar,
    });
    return { user: created, isNew: true };
  }
}
