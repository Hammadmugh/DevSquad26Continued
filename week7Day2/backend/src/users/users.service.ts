import { Injectable } from '@nestjs/common';
import { NewsletterService } from '../newsletter/newsletter.service';

export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(private readonly newsletterService: NewsletterService) {}

  async findOrCreate(profile: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<User> {
    let user = this.users.find((u) => u.googleId === profile.googleId);
    if (!user) {
      user = {
        id: Date.now().toString(),
        ...profile,
        createdAt: new Date(),
      };
      this.users.push(user);
      // Send welcome email to new users (fire-and-forget)
      this.newsletterService.sendWelcomeEmail(user.email, user.name).catch(() => {});
    }
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }
}
