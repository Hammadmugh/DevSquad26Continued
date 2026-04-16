import { Injectable } from '@nestjs/common';

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
    }
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }
}
