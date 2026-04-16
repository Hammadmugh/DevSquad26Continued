import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  private readonly frontendUrl: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
  }

  /** POST /api/auth/register */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** POST /api/auth/login */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── Google OAuth ──────────────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    await this._oauthRedirect(req, res);
  }

  // ─── GitHub OAuth ──────────────────────────────────────────────────────────

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Passport redirects to GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    await this._oauthRedirect(req, res);
  }

  // ─── Discord OAuth ─────────────────────────────────────────────────────────

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordAuth() {
    // Passport redirects to Discord
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(@Req() req: Request, @Res() res: Response) {
    await this._oauthRedirect(req, res);
  }

  // ─── Shared helper ─────────────────────────────────────────────────────────

  private async _oauthRedirect(req: Request, res: Response) {
    try {
      const { access_token, user, isNew } = await this.authService.oauthLogin(
        (req as any).user,
      );
      const userEncoded = Buffer.from(JSON.stringify(user)).toString('base64url');
      const url = new URL(`${this.frontendUrl}/auth/callback`);
      url.searchParams.set('token', access_token);
      url.searchParams.set('user', userEncoded);
      url.searchParams.set('isNew', String(isNew));
      return res.redirect(url.toString());
    } catch {
      return res.redirect(`${this.frontendUrl}?authError=1`);
    }
  }
}

