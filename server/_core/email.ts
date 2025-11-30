import nodemailer from 'nodemailer';
import { getVerificationEmailTemplate, getWelcomeEmailTemplate } from './emailTemplates';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || 'info@bithrahapp.com';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'بذرة <info@bithrahapp.com>';

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationLink: string
): Promise<boolean> {
  try {
    const { subject, html } = getVerificationEmailTemplate({
      userName: name,
      verificationLink,
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  referralCode?: string
): Promise<boolean> {
  try {
    if (!referralCode) {
      // Simple welcome email without referral
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: 'مرحباً بك في بذرة',
        html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>مرحباً بك</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">بذرة</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">منصة الوساطة الذكية</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">مرحباً ${name}</h2>
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                تم تفعيل حسابك بنجاح. أنت الآن جزء من مجتمع بذرة.
              </p>
              <p style="margin: 30px 0 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                نتطلع لرؤية أفكارك تنمو معنا.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                بذرة - منصة الوساطة الذكية
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                © 2024 جميع الحقوق محفوظة
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });
      return true;
    }

    const referralLink = `https://bithrahapp.com/?ref=${referralCode}`;
    const { subject, html } = getWelcomeEmailTemplate({
      userName: name,
      referralCode,
      referralLink,
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'إعادة تعيين كلمة المرور - بذرة',
      html: `<p>اضغط هنا لإعادة تعيين كلمة المرور: <a href="${resetLink}">إعادة تعيين</a></p>`,
    });
    return true;
  } catch (error) {
    return false;
  }
}
