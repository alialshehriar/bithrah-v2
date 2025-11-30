/**
 * Email Templates - Professional design without emojis
 */

export function getVerificationEmailTemplate(params: {
  userName: string;
  verificationLink: string;
}): { subject: string; html: string } {
  const { userName, verificationLink } = params;

  return {
    subject: 'تفعيل حسابك في بذرة',
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تفعيل حسابك</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">بذرة</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">منصة الوساطة الذكية</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">مرحباً ${userName}</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                شكراً لتسجيلك في بذرة. نحن متحمسون لانضمامك إلى مجتمعنا.
              </p>

              <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                لإكمال عملية التسجيل وتفعيل حسابك، يرجى النقر على الزر أدناه:
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                      تفعيل الحساب
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
              </p>

              <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                إذا واجهت مشكلة في النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:
              </p>

              <p style="margin: 10px 0 0 0; color: #667eea; font-size: 12px; word-break: break-all;">
                ${verificationLink}
              </p>
            </td>
          </tr>

          <!-- Footer -->
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
  };
}

export function getWelcomeEmailTemplate(params: {
  userName: string;
  referralCode: string;
  referralLink: string;
}): { subject: string; html: string } {
  const { userName, referralCode, referralLink } = params;

  return {
    subject: 'مرحباً بك في بذرة',
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">بذرة</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">منصة الوساطة الذكية</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">مرحباً ${userName}</h2>
              
              <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                تم تفعيل حسابك بنجاح. أنت الآن جزء من مجتمع بذرة.
              </p>

              <div style="background-color: #f7fafc; border-radius: 8px; padding: 30px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1a202c; font-size: 18px; font-weight: 600;">كود الإحالة الخاص بك</h3>
                <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">
                  شارك هذا الكود مع أصدقائك واحصل على سنوات إضافية مجانية:
                </p>
                <div style="background-color: #ffffff; border: 2px dashed #667eea; border-radius: 6px; padding: 15px; text-align: center; margin: 15px 0;">
                  <code style="font-size: 24px; font-weight: 700; color: #667eea; letter-spacing: 2px;">${referralCode}</code>
                </div>
                <p style="margin: 15px 0 0 0; color: #718096; font-size: 13px;">
                  أو شارك الرابط المباشر:
                </p>
                <p style="margin: 5px 0 0 0; color: #667eea; font-size: 13px; word-break: break-all;">
                  ${referralLink}
                </p>
              </div>

              <div style="background-color: #edf2f7; border-right: 4px solid #667eea; border-radius: 4px; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1a202c; font-size: 16px; font-weight: 600;">كيف تحصل على سنوات إضافية؟</h4>
                <ul style="margin: 0; padding-right: 20px; color: #4a5568; font-size: 14px; line-height: 1.8;">
                  <li>كل 5 أشخاص يسجلون باستخدام كودك = سنة واحدة مجانية</li>
                  <li>لا يوجد حد أقصى للسنوات المجانية</li>
                  <li>ابدأ بدعوة أصدقائك الآن</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                نتطلع لرؤية أفكارك تنمو معنا.
              </p>
            </td>
          </tr>

          <!-- Footer -->
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
  };
}
