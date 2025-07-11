import nodemailer from 'nodemailer';
import { logger } from '../logger';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendPasswordSetupEmail(email: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const setupUrl = `${frontendUrl}/setup-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: email,
      subject: 'Set up your account password',
      html: `
        <h1>Welcome to our platform!</h1>
        <p>An account has been created for you. Please click the link below to set up your password:</p>
        <p><a href="${setupUrl}">Set up your password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this account, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password setup email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send password setup email', { error, email });
      throw new Error('Failed to send password setup email');
    }
  }
}
