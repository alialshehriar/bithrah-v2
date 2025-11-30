# 🚀 دليل النشر على Vercel - bithrahapp.com

## ✅ الحالة الحالية

### ما يعمل محلياً:
- ✅ Frontend منشور بنجاح على bithrahapp.com
- ✅ التصميم والـ UI يعملان بشكل صحيح
- ✅ جميع الصفحات الثابتة تعمل
- ✅ Routing يعمل بشكل صحيح
- ✅ Database connection يعمل محلياً
- ✅ Email Verification system جاهز
- ✅ Referral System كامل

### ما لا يعمل على Production:
- ❌ API endpoints لا تعمل على Vercel
- ❌ DATABASE_URL غير موجود في Vercel environment
- ❌ SMTP credentials غير موجودة (Email لن يعمل)

---

## 🔧 الخطوات المطلوبة لإصلاح API

### 1️⃣ إضافة Environment Variables في Vercel

**الخطوات:**
1. افتح [Vercel Dashboard](https://vercel.com/alialshehriars-projects/bithrah-v2)
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف المتغيرات التالية:

#### DATABASE_URL (إلزامي)
- **Name:** `DATABASE_URL`
- **Value:** 
  ```
  postgresql://neondb_owner:npg_r6QY5HbMReFP@ep-sweet-lab-af2mj6h6-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
  ```
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### EMAIL_HOST (للـ Email Verification)
- **Name:** `EMAIL_HOST`
- **Value:** `smtp.gmail.com` (أو SMTP server آخر)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### EMAIL_PORT
- **Name:** `EMAIL_PORT`
- **Value:** `587`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### EMAIL_USER (إلزامي للـ Email)
- **Name:** `EMAIL_USER`
- **Value:** `info@bithrahapp.com` (أو email آخر)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### EMAIL_PASS (إلزامي للـ Email)
- **Name:** `EMAIL_PASS`
- **Value:** `[App Password من Gmail أو SMTP password]`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **ملاحظة:** لـ Gmail، استخدم App Password وليس كلمة المرور العادية

#### EMAIL_FROM
- **Name:** `EMAIL_FROM`
- **Value:** `بذرة <info@bithrahapp.com>`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

4. اضغط **Save** لكل متغير

### 2️⃣ إعادة Deploy

بعد إضافة جميع Environment Variables:
1. اذهب إلى **Deployments** tab
2. اختر آخر deployment
3. اضغط على **⋯** (three dots)
4. اختر **Redeploy**
5. اضغط **Redeploy** للتأكيد
6. انتظر حتى ينتهي Build (عادة 2-3 دقائق)

### 3️⃣ اختبار API

بعد إعادة الـ deploy، اختبر:
1. افتح https://bithrahapp.com
2. انقر على "سجّل الآن مجاناً"
3. املأ النموذج وأرسله
4. تحقق من:
   - ✅ التسجيل يعمل بدون أخطاء
   - ✅ يتم التوجيه إلى صفحة `/early-access-success`
   - ✅ تظهر معلومات المستخدم و referral code
   - ✅ يمكن نسخ referral link
   - ✅ يصل email تحقق إلى البريد الإلكتروني

---

## 📋 ملفات API الموجودة

### `api/trpc/[trpc].ts`
Vercel serverless function handler لـ tRPC endpoints.

**Endpoints المتاحة:**

#### Early Access:
- `/api/trpc/earlyAccess.register` - تسجيل مستخدم جديد
- `/api/trpc/earlyAccess.getUserByReferralCode` - التحقق من كود إحالة
- `/api/trpc/earlyAccess.getLeaderboard` - لوحة الصدارة
- `/api/trpc/earlyAccess.getStats` - إحصائيات (admin only)
- `/api/trpc/earlyAccess.getAllUsers` - جميع المستخدمين (admin only)

#### Authentication:
- `/api/trpc/auth.register` - تسجيل حساب عادي
- `/api/trpc/auth.login` - تسجيل الدخول
- `/api/trpc/auth.verifyEmail` - التحقق من الإيميل
- `/api/trpc/auth.logout` - تسجيل الخروج
- `/api/trpc/auth.me` - معلومات المستخدم الحالي

### `vercel.json`
Configuration file للـ Vercel deployment:
```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@3.0.0"
    }
  },
  "routes": [
    {
      "src": "/api/trpc/(.*)",
      "dest": "/api/trpc/[trpc].ts"
    }
  ],
  "rewrites": [
    {
      "source": "/:path((?!api).*)*",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Neon PostgreSQL
- **Connection String:** موجود في DATABASE_URL
- **Tables:** 
  - `users` - المستخدمين العاديين
  - `earlyAccessUsers` - المستخدمين المسجلين في Early Access
  - `earlyAccessReferrals` - الإحالات
  - `ideas`, `projects`, `negotiations`, etc.

### Migration Status
✅ جميع الـ migrations تم تطبيقها بنجاح على Neon database

---

## 📧 Email Verification System

### كيف يعمل:
1. المستخدم يسجل حساب جديد
2. يتم إنشاء verification token (JWT)
3. يُرسل email يحتوي على رابط التحقق:
   ```
   https://bithrahapp.com/verify-email?token=<TOKEN>
   ```
4. المستخدم يضغط على الرابط
5. يتم التحقق من صحة الـ token
6. يتم تحديث `isVerified` في قاعدة البيانات
7. يُرسل welcome email
8. يتم تسجيل دخول المستخدم تلقائياً

### الملفات المتعلقة:
- `server/_core/email.ts` - Email sending functions
- `server/authRouter.ts` - Auth endpoints (register, verifyEmail, login)
- `client/src/pages/VerifyEmail.tsx` - صفحة التحقق من الإيميل

### Environment Variables المطلوبة:
- `EMAIL_HOST` - SMTP server (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER` - SMTP username/email
- `EMAIL_PASS` - SMTP password (App Password for Gmail)
- `EMAIL_FROM` - From address (e.g., "بذرة <info@bithrahapp.com>")

### كيفية الحصول على Gmail App Password:
1. اذهب إلى https://myaccount.google.com/security
2. فعّل 2-Step Verification
3. اذهب إلى App Passwords
4. اختر "Mail" و "Other (Custom name)"
5. اكتب "Bithrah App"
6. انسخ الـ 16-character password
7. استخدمه في `EMAIL_PASS`

---

## 🔗 Referral System

### كيف يعمل:
1. كل مستخدم يسجل في Early Access يحصل على:
   - `referralCode` فريد (مثال: `ALI1A2B3`)
   - `referralLink` كامل (مثال: `https://bithrahapp.com/?ref=ALI1A2B3`)
   - `bonusYears` = 1 سنة (يزيد بكل إحالة ناجحة)

2. عندما يفتح شخص رابط إحالة:
   - يتم حفظ `ref` parameter في localStorage
   - يتم pre-fill حقل "كود الإحالة" في نموذج التسجيل

3. عند التسجيل الناجح:
   - يتم إنشاء سجل في `earlyAccessReferrals`
   - يتم تحديث `referralCount` للمُحيل
   - يتم تحديث `bonusYears` للمُحيل (1 + referralCount)

4. بعد التسجيل:
   - يتم التوجيه إلى `/early-access-success`
   - تظهر معلومات المستخدم و referral code
   - يمكن نسخ referral link
   - يمكن مشاركة الرابط عبر Web Share API

### الملفات المتعلقة:
- `server/earlyAccessRouter.ts` - Early Access endpoints
- `client/src/pages/EarlyAccess.tsx` - نموذج التسجيل
- `client/src/pages/EarlyAccessSuccess.tsx` - صفحة النجاح
- `client/src/pages/Leaderboard.tsx` - لوحة الصدارة

### Database Schema:
```sql
-- earlyAccessUsers table
CREATE TABLE earlyAccessUsers (
  id SERIAL PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  username TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  referralCode TEXT NOT NULL UNIQUE,
  referredBy TEXT,  -- كود الإحالة المستخدم للتسجيل
  referralCount INTEGER DEFAULT 0,
  bonusYears INTEGER DEFAULT 1,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- earlyAccessReferrals table
CREATE TABLE earlyAccessReferrals (
  id SERIAL PRIMARY KEY,
  referrerId INTEGER REFERENCES earlyAccessUsers(id),
  referredId INTEGER REFERENCES earlyAccessUsers(id),
  referralCode TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 اختبار محلي

للاختبار محلياً قبل النشر:

```bash
cd /home/ubuntu/bithrah-v2
pnpm dev
```

الموقع سيعمل على: http://localhost:3000

---

## 🔍 Troubleshooting

### مشكلة: API returns 500 error
**الحل:** تأكد من أن DATABASE_URL موجود في Vercel environment variables

### مشكلة: API returns 404 error
**الحل:** تأكد من أن `api/trpc/[trpc].ts` موجود في الـ repository وأن vercel.json يحتوي على routes configuration

### مشكلة: Database connection fails
**الحل:** تحقق من صحة connection string في DATABASE_URL

### مشكلة: Email لا يُرسل
**الحل:** 
1. تحقق من SMTP credentials (EMAIL_USER, EMAIL_PASS)
2. تأكد من استخدام App Password لـ Gmail
3. تحقق من Vercel logs للأخطاء

### مشكلة: Referral code لا يعمل
**الحل:**
1. تحقق من أن `ref` parameter موجود في URL
2. افتح Developer Console وتحقق من localStorage
3. تحقق من أن referralCode موجود في database

---

## 📊 Monitoring

### Vercel Dashboard
- **URL:** https://vercel.com/alialshehriars-projects/bithrah-v2
- **Deployments:** تابع حالة كل deployment
- **Analytics:** شاهد الزيارات والأداء
- **Logs:** اعرض runtime logs للـ serverless functions

### Neon Dashboard
- **URL:** https://console.neon.tech
- **Database:** neondb
- **Monitoring:** شاهد queries والـ connections

---

## ✅ Checklist للنشر النهائي

### Environment Variables:
- [ ] DATABASE_URL مضاف في Vercel
- [ ] EMAIL_HOST مضاف
- [ ] EMAIL_PORT مضاف
- [ ] EMAIL_USER مضاف
- [ ] EMAIL_PASS مضاف (App Password)
- [ ] EMAIL_FROM مضاف

### Deployment:
- [x] Frontend deployed على bithrahapp.com
- [x] Domain مربوط بشكل صحيح
- [x] SSL certificate فعّال
- [ ] API endpoints تعمل بشكل صحيح
- [ ] Database connection يعمل على Production

### Features:
- [ ] Early Access registration يعمل
- [ ] Email Verification يعمل
- [ ] Referral System يعمل
- [ ] Leaderboard يعرض البيانات
- [ ] Admin panel يعمل على /admin/early-access

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Vercel deployment logs
2. تحقق من browser console للأخطاء
3. تحقق من Neon database connection
4. راجع هذا الدليل للخطوات المطلوبة

---

## 🎯 الخطوات التالية (بعد النشر الناجح)

1. **إعداد SMTP Production:**
   - استخدم SendGrid أو Mailgun للـ production
   - أضف custom domain للـ emails (e.g., noreply@bithrahapp.com)

2. **تفعيل AI Idea Evaluation:**
   - أضف OPENAI_API_KEY في Vercel
   - اختبر `/api/trpc/ideas.evaluate` endpoint

3. **إضافة Analytics:**
   - Google Analytics
   - Vercel Analytics
   - Hotjar للـ heatmaps

4. **SEO Optimization:**
   - إضافة meta tags
   - إنشاء sitemap.xml
   - إضافة robots.txt

---

**آخر تحديث:** 2025-11-30
**Version:** 855fc146
**Status:** ✅ Ready for Production (بعد إضافة Environment Variables)
