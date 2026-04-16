import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class NewsletterService {
  private subscribers: Set<string> = new Set();
  private readonly logger = new Logger(NewsletterService.name);

  constructor(private configService: ConfigService) {}

  async subscribe(email: string): Promise<{ message: string }> {
    if (this.subscribers.has(email)) {
      throw new ConflictException('This email is already subscribed.');
    }

    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    if (!apiKey) {
      this.logger.warn('BREVO_API_KEY not set. Skipping Brevo integration.');
      this.subscribers.add(email);
      return { message: 'Successfully subscribed to the newsletter!' };
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;

    // Add contact to Brevo list
    const contactsApi = new SibApiV3Sdk.ContactsApi();
    try {
      await contactsApi.createContact({
        email,
        listIds: [2],
      });
    } catch (err: any) {
      const code = err?.response?.body?.code;
      if (code === 'duplicate_parameter') {
        throw new ConflictException('This email is already subscribed.');
      }
      this.logger.error('Brevo createContact error', err?.response?.body);
      throw new InternalServerErrorException('Failed to add contact to Brevo.');
    }

    // Send confirmation email via Brevo transactional API
    const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
    try {
      await transactionalEmailsApi.sendTransacEmail({
        to: [{ email }],
        sender: {
          email:
            this.configService.get<string>('SENDER_EMAIL') ||
            'noreply@circlechain.io',
          name: 'Circlechain',
        },
        subject: '🚀 Welcome to Circlechain Newsletter!',
        htmlContent: this.buildConfirmationEmail(email),
      });
    } catch (err: any) {
      this.logger.error('Brevo sendTransacEmail error', err?.response?.body);
      throw new InternalServerErrorException(
        'Subscribed but failed to send confirmation email.',
      );
    }

    this.subscribers.add(email);
    return { message: 'Successfully subscribed to the newsletter!' };
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    if (!apiKey) {
      this.logger.warn('BREVO_API_KEY not set. Skipping welcome email.');
      return;
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;

    const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
    try {
      await transactionalEmailsApi.sendTransacEmail({
        to: [{ email, name }],
        sender: {
          email:
            this.configService.get<string>('SENDER_EMAIL') ||
            'noreply@circlechain.io',
          name: 'Circlechain',
        },
        subject: '🎉 Welcome to Circlechain!',
        htmlContent: this.buildWelcomeEmail(name),
      });
    } catch (err: any) {
      this.logger.error('Welcome email send error', err?.response?.body);
    }
  }

  private buildWelcomeEmail(name: string): string {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Circlechain</title>
</head>
<body style="margin:0;padding:0;background-color:#010010;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#010010;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#010010;border:1px solid rgba(115,253,170,0.3);border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#010010 0%,rgba(115,253,170,0.1) 100%);padding:40px 40px 30px;text-align:center;border-bottom:1px solid rgba(115,253,170,0.2);">
              <span style="color:#fff;font-size:28px;font-weight:700;letter-spacing:1px;">Circlechain</span>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td style="padding:50px 40px 30px;text-align:center;">
              <div style="font-size:56px;margin-bottom:20px;">🎉</div>
              <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0 0 16px;line-height:1.3;">
                Welcome aboard, ${name}!
              </h1>
              <p style="color:#73FDAA;font-size:16px;margin:0 0 20px;">
                Your account has been created successfully.
              </p>
              <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 30px;line-height:1.6;">
                You're now part of the Circlechain community — a decentralized platform built for the future of blockchain asset trading.
              </p>
            </td>
          </tr>
          <!-- Features -->
          <tr>
            <td style="padding:0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px;background:rgba(115,253,170,0.08);border:1px solid rgba(115,253,170,0.2);border-radius:12px;">
                    <p style="color:#73FDAA;font-size:14px;font-weight:700;margin:0 0 4px;">💼 Access Token Markets</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Buy, sell and manage your blockchain assets in one place.</p>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:16px;background:rgba(115,253,170,0.08);border:1px solid rgba(115,253,170,0.2);border-radius:12px;">
                    <p style="color:#73FDAA;font-size:14px;font-weight:700;margin:0 0 4px;">📊 Real-Time Market Trends</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Track BTC, ETH, BNB, USDT and more in real time.</p>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:16px;background:rgba(115,253,170,0.08);border:1px solid rgba(115,253,170,0.2);border-radius:12px;">
                    <p style="color:#73FDAA;font-size:14px;font-weight:700;margin:0 0 4px;">🔐 Secure & Decentralized</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Your assets, your ownership — powered by Web3.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 50px;text-align:center;">
              <a href="${frontendUrl}/dashboard"
                 style="display:inline-block;background:#73FDAA;color:#010010;padding:16px 40px;border-radius:20px;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                Go to Dashboard
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(115,253,170,0.2);text-align:center;">
              <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">
                &copy; 2022 Circlechain. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private buildConfirmationEmail(email: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Circlechain</title>
</head>
<body style="margin:0;padding:0;background-color:#010010;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#010010;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#010010;border:1px solid rgba(115,253,170,0.3);border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#010010 0%,rgba(115,253,170,0.1) 100%);padding:40px 40px 30px;text-align:center;border-bottom:1px solid rgba(115,253,170,0.2);">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:12px;height:12px;background:#fff;border-radius:50%;margin:3px;display:inline-block;"></td>
                        <td style="width:12px;height:12px;background:#fff;border-radius:50%;padding-left:8px;display:inline-block;"></td>
                      </tr>
                      <tr>
                        <td style="width:12px;height:12px;background:#fff;border-radius:50%;margin:3px;display:inline-block;padding-top:8px;"></td>
                        <td style="width:12px;height:12px;background:#fff;border-radius:50%;padding-left:8px;padding-top:8px;display:inline-block;"></td>
                      </tr>
                    </table>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#fff;font-size:28px;font-weight:700;letter-spacing:1px;">Circlechain</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td style="padding:50px 40px 30px;text-align:center;">
              <div style="font-size:48px;margin-bottom:20px;">🚀</div>
              <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0 0 16px;line-height:1.3;">
                Welcome to Circlechain Newsletter!
              </h1>
              <p style="color:#73FDAA;font-size:16px;margin:0 0 30px;">
                You're now part of the blockchain revolution.
              </p>
              <p style="color:rgba(255,255,255,0.8);font-size:15px;margin:0 0 30px;line-height:1.6;">
                Hi there! Thank you for subscribing with <strong style="color:#BBFFFF;">${email}</strong>.<br/>
                You'll be the first to know about the latest updates, market trends, and exclusive insights.
              </p>
            </td>
          </tr>
          <!-- Features -->
          <tr>
            <td style="padding:0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:16px;background:rgba(115,253,170,0.08);border:1px solid rgba(115,253,170,0.2);border-radius:12px;margin-bottom:12px;">
                    <p style="color:#73FDAA;font-size:14px;font-weight:700;margin:0 0 4px;">📈 Market Trends</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Real-time crypto market analysis and trends</p>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:16px;background:rgba(115,253,170,0.08);border:1px solid rgba(115,253,170,0.2);border-radius:12px;">
                    <p style="color:#73FDAA;font-size:14px;font-weight:700;margin:0 0 4px;">🔐 Security Updates</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Latest platform security and feature updates</p>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="padding:16px;background:rgba(115,253,170,0.08);border:1px solid rgba(115,253,170,0.2);border-radius:12px;">
                    <p style="color:#73FDAA;font-size:14px;font-weight:700;margin:0 0 4px;">💡 Trading Insights</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Expert tips and strategies for crypto trading</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 50px;text-align:center;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}"
                 style="display:inline-block;background:#73FDAA;color:#010010;padding:16px 40px;border-radius:20px;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                Start Trading Now
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(115,253,170,0.2);text-align:center;">
              <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;">
                (c) 2022 Circlechain. All rights reserved.<br/>
                <a href="#" style="color:#73FDAA;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}
