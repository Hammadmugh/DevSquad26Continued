import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET', ''),
      callbackURL: `${configService.get<string>('BACKEND_URL', 'http://localhost:3001')}/api/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    try {
      const email =
        profile.emails?.find((e: any) => e.primary)?.value ??
        profile.emails?.[0]?.value ??
        `${profile.id}@github.oauth.placeholder`;

      const result = await this.authService.validateOAuthUser({
        providerId: String(profile.id),
        provider: 'github',
        email,
        name: profile.displayName ?? profile.username ?? 'GitHub User',
        avatar: profile.photos?.[0]?.value,
      });
      done(null, result);
    } catch (err) {
      done(err, undefined);
    }
  }
}
