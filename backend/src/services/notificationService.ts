import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Configure email transporter
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Configure Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const notificationService = {
  async sendVerificationEmail(email: string, tempPassword: string, fullName: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
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
    };

    try {
      await emailTransporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  },

  async sendVerificationSMS(phone: string, tempPassword: string) {
    try {
      await twilioClient.messages.create({
        body: `Your MaidMatch account has been verified. Your temporary password is: ${tempPassword}. Please change it upon first login.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log('Verification SMS sent successfully');
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      throw error;
    }
  },

  async sendRejectionEmail(email: string, fullName: string, reason: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'MaidMatch Registration Status',
      html: `
        <h1>MaidMatch Registration Update</h1>
        <p>Dear ${fullName},</p>
        <p>We regret to inform you that your registration has been rejected for the following reason:</p>
        <p>${reason}</p>
        <p>If you believe this is a mistake or would like to provide additional information, please contact our support team.</p>
        <p>Best regards,<br>The MaidMatch Team</p>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
      console.log('Rejection email sent successfully');
    } catch (error) {
      console.error('Error sending rejection email:', error);
      throw error;
    }
  },

  async sendRejectionSMS(phone: string) {
    try {
      await twilioClient.messages.create({
        body: 'Your MaidMatch registration has been rejected. Please check your email for more details.',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log('Rejection SMS sent successfully');
    } catch (error) {
      console.error('Error sending rejection SMS:', error);
      throw error;
    }
  },
};
