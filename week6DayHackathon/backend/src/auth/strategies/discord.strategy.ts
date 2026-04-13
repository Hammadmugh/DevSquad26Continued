import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

// passport-discord does not ship TS declarations; use require to avoid errors
// eslint-disable-next-line @typescript-eslint/no-require-imports
const DiscordStrategyBase = require('passport-discord').Strategy;

@Injectable()
export class DiscordStrategy extends PassportStrategy(
  DiscordStrategyBase,
  'discord',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID', ''),
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET', ''),
      callbackURL: `${configService.get<string>('BACKEND_URL', 'http://localhost:3001')}/api/auth/discord/callback`,
      scope: ['identify', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user?: any) => void,
  ) {
    try {
      const avatarUrl = profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
        : undefined;

      const result = await this.authService.validateOAuthUser({
        providerId: String(profile.id),
        provider: 'discord',
        email:
          profile.email ?? `${profile.id}@discord.oauth.placeholder`,
        name:
          profile.global_name ?? profile.username ?? 'Discord User',
        avatar: avatarUrl,
      });
      done(null, result);
    } catch (err) {
      done(err, undefined);
    }
  }
}
