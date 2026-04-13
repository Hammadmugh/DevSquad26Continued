import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: `${configService.get<string>('BACKEND_URL', 'http://localhost:3001')}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const result = await this.authService.validateOAuthUser({
        providerId: profile.id,
        provider: 'google',
        email:
          profile.emails?.[0]?.value ??
          `${profile.id}@google.oauth.placeholder`,
        name: profile.displayName ?? 'Google User',
        avatar: profile.photos?.[0]?.value,
      });
      done(null, result);
    } catch (err) {
      done(err as Error, undefined);
    }
  }
}
