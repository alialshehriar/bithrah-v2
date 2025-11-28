import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || 'info@bithrahapp.com';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'بذرة <info@bithrahapp.com>';

// Create transporter
const transporter = nodemailer.createTransporter({
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
export async function sendVerificationEmail(email: string, verificationLink: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'تأكيد البريد الإلكتروني - بذرة',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تأكيد البريد الإلكتروني</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">مرحباً بك في بذرة! 🌱</h1>
            </div>
            <div style="padding: 40px 30px;">
              <p>شكراً لتسجيلك في منصة بذرة. لإكمال عملية التسجيل، يرجى تأكيد بريدك الإلكتروني:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  تأكيد البريد الإلكتروني
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'مرحباً بك في بذرة! 🎉',
      html: `<h1>مرحباً ${name}!</h1><p>تم تفعيل حسابك بنجاح.</p>`,
    });
    return true;
  } catch (error) {
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
