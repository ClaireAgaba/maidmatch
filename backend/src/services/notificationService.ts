import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { AppError } from '../middleware/errorHandler';

dotenv.config();

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

// Configure email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Configure Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export const notificationService = {
  async sendEmail(config: EmailConfig) {
    if (!process.env.EMAIL_USER) {
      throw new AppError(500, 'Email service not configured');
    }

    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        ...config,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new AppError(500, 'Failed to send email');
    }
  },

  async sendSMS(to: string, body: string) {
    if (!twilioClient) {
      throw new AppError(500, 'SMS service not configured');
    }

    try {
      await twilioClient.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        body,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new AppError(500, 'Failed to send SMS');
    }
  },

  async sendVerificationEmail(email: string, tempPassword: string, fullName: string) {
    await this.sendEmail({
      to: email,
      subject: 'MaidMatch Account Verification',
      html: `
        <h1>Welcome to MaidMatch!</h1>
        <p>Dear ${fullName},</p>
        <p>Your account has been verified and approved. You can now log in to MaidMatch using:</p>
        <p>Email: ${email}</p>
        <p>Temporary Password: ${tempPassword}</p>
        <p><strong>Important:</strong> For security reasons, you will be required to change your password on your first login.</p>
        <p>Best regards,<br>The MaidMatch Team</p>
      `,
    });
  },

  async sendVerificationSMS(phone: string, tempPassword: string) {
    await this.sendSMS(
      phone,
      `Your MaidMatch account has been verified. Your temporary password is: ${tempPassword}. Please change it upon first login.`
    );
  },

  async sendRejectionEmail(email: string, fullName: string, reason: string) {
    await this.sendEmail({
      to: email,
      subject: 'MaidMatch Application Status',
      html: `
        <h1>MaidMatch Application Update</h1>
        <p>Dear ${fullName},</p>
        <p>We regret to inform you that your application to join MaidMatch has been declined.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>If you believe this decision was made in error or if you'd like to appeal, 
        please contact our support team.</p>
        <p>Best regards,<br>The MaidMatch Team</p>
      `,
    });
  },

  async sendRejectionSMS(phone: string) {
    await this.sendSMS(
      phone,
      'Your MaidMatch application has been declined. Please check your email for more details.'
    );
  },

  async sendJobApplicationNotification(email: string, fullName: string, jobTitle: string) {
    await this.sendEmail({
      to: email,
      subject: 'New Job Application Received',
      html: `
        <h1>New Job Application</h1>
        <p>Dear ${fullName},</p>
        <p>You have received a new application for your job posting: "${jobTitle}"</p>
        <p>Please log in to your MaidMatch account to review the application.</p>
        <p>Best regards,<br>The MaidMatch Team</p>
      `,
    });
  },

  async sendApplicationStatusUpdate(email: string, fullName: string, jobTitle: string, status: string) {
    await this.sendEmail({
      to: email,
      subject: 'Job Application Status Update',
      html: `
        <h1>Application Status Update</h1>
        <p>Dear ${fullName},</p>
        <p>Your application for the position "${jobTitle}" has been ${status}.</p>
        <p>Please log in to your MaidMatch account for more details.</p>
        <p>Best regards,<br>The MaidMatch Team</p>
      `,
    });
  },

  async sendNewMessageNotification(email: string, fullName: string, senderName: string) {
    await this.sendEmail({
      to: email,
      subject: 'New Message on MaidMatch',
      html: `
        <h1>New Message</h1>
        <p>Dear ${fullName},</p>
        <p>You have received a new message from ${senderName} on MaidMatch.</p>
        <p>Please log in to your account to view and respond to the message.</p>
        <p>Best regards,<br>The MaidMatch Team</p>
      `,
    });
  },
};
