import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Reservation } from '../reservations/entity/reservations.entity';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: nodemailer.Transporter;
  private mailEnabled = false;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('MAIL_HOST');
    const port = Number(this.config.get<string>('MAIL_PORT') || '587');
    const user = this.config.get<string>('MAIL_USER');
    const pass = this.config.get<string>('MAIL_PASS');
    const secure = (this.config.get<string>('MAIL_SECURE') || '').toLowerCase() === 'true' || port === 465;

    if (!host || !user || !pass || host.includes('your-provider.com')) {
      this.logger.warn('SMTP is not configured. Set MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS and MAIL_FROM in backend/.env.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    this.mailEnabled = true;
  }

  async onModuleInit() {
    if (!this.mailEnabled) {
      return;
    }

    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified. Ticket emails are enabled.');
    } catch (error) {
      this.mailEnabled = false;
      this.logger.error('SMTP verification failed. Ticket emails are disabled until config is fixed.', error instanceof Error ? error.stack : undefined);
    }
  }

  async sendTicket(reservation: Reservation, qrCodeDataUrl: string): Promise<void> {
    if (!this.mailEnabled) {
      this.logger.warn(`Skipping ticket email for ${reservation.email} because SMTP is disabled.`);
      return;
    }

    // Convert data URL to buffer for embedding as inline image
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(base64Data, 'base64');
    const qrCid = `qrcode-${reservation.id}@jamxv.local`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your Ticket — Jam Session XV</title>
        </head>
        <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:16px;overflow:hidden;border:1px solid #222;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #222;">
                      <p style="margin:0 0 8px;font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#888;">CinéRadio INSAT presents</p>
                      <h1 style="margin:0;font-size:36px;font-weight:900;letter-spacing:2px;color:#ffffff;">JAM SESSION</h1>
                      <p style="margin:4px 0 0;font-size:48px;font-weight:900;color:#e0b44a;line-height:1;">XV</p>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding:32px 40px 0;">
                      <p style="margin:0;font-size:16px;color:#aaa;">Hey <strong style="color:#fff;">${reservation.fullName}</strong>,</p>
                      <p style="margin:12px 0 0;font-size:15px;color:#888;line-height:1.6;">
                        Your spot is confirmed. Show the QR code below at the entrance on the day of the event.
                      </p>
                    </td>
                  </tr>

                  <!-- QR Code -->
                  <tr>
                    <td align="center" style="padding:32px 40px;">
                      <div style="background:#ffffff;border-radius:12px;padding:16px;display:inline-block;">
                        <img src="cid:${qrCid}" width="220" height="220" alt="Your QR Code" style="display:block;" />
                      </div>
                      <p style="margin:12px 0 0;font-size:11px;color:#555;letter-spacing:2px;text-transform:uppercase;">
                        Reservation ID: ${reservation.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                  </tr>

                  <!-- Details -->
                  <tr>
                    <td style="padding:0 40px 32px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:10px;overflow:hidden;">
                        <tr>
                          <td style="padding:16px 20px;border-bottom:1px solid #222;">
                            <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;">Name</p>
                            <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600;">${reservation.fullName}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:16px 20px;border-bottom:1px solid #222;">
                            <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;">University</p>
                            <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600;">${reservation.university}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;">Event</p>
                            <p style="margin:4px 0 0;font-size:15px;color:#fff;font-weight:600;">Jam Session XV — CinéRadio INSAT</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px 32px;text-align:center;border-top:1px solid #1a1a1a;">
                      <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">
                        Lost your ticket? Visit our website and use the "Resend my ticket" option.<br/>
                        See you there. 🎶
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

    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: reservation.email,
      subject: '🎶 Your ticket — Jam Session XV',
      html,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer,
          contentType: 'image/png',
          contentDisposition: 'inline',
          cid: qrCid, // referenced in img src="cid:..."
        },
      ],
    });
  }
}