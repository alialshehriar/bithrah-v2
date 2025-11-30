# 🚀 دليل النشر على Vercel - bithrahapp.com

## ✅ الحالة الحالية

### ما يعمل:
- ✅ Frontend منشور بنجاح على bithrahapp.com
- ✅ التصميم والـ UI يعملان بشكل صحيح
- ✅ جميع الصفحات الثابتة تعمل
- ✅ Routing يعمل بشكل صحيح

### ما لا يعمل:
- ❌ API endpoints لا تعمل على Vercel
- ❌ Early Access registration form لا يمكنه الإرسال
- ❌ Leaderboard لا يحمل البيانات
- ❌ Admin panel لا يمكنه جلب البيانات

---

## 🔧 الخطوات المطلوبة لإصلاح API

### 1️⃣ إضافة DATABASE_URL في Vercel

**الخطوات:**
1. افتح [Vercel Dashboard](https://vercel.com/alialshehriars-projects/bithrah-v2)
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف متغير جديد:
   - **Name:** `DATABASE_URL`
   - **Value:** 
     ```
     postgresql://neondb_owner:npg_r6QY5HbMReFP@ep-sweet-lab-af2mj6h6-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
     ```
   - **Environments:** Production, Preview, Development (اختر الكل)
4. اضغط **Save**

### 2️⃣ إعادة Deploy

بعد إضافة DATABASE_URL:
1. اذهب إلى **Deployments** tab
2. اختر آخر deployment
3. اضغط على **⋯** (three dots)
4. اختر **Redeploy**
5. اضغط **Redeploy** للتأكيد

### 3️⃣ اختبار API

بعد إعادة الـ deploy، اختبر:
1. افتح https://bithrahapp.com
2. انقر على "سجّل الآن مجاناً"
3. املأ النموذج وأرسله
4. تحقق من أن التسجيل يعمل بدون أخطاء

---

## 📋 ملفات API الموجودة

### `api/trpc/[trpc].ts`
Vercel serverless function handler لـ tRPC endpoints.

**Endpoints المتاحة:**
- `/api/trpc/earlyAccess.register` - تسجيل مستخدم جديد
- `/api/trpc/earlyAccess.getReferralStats` - إحصائيات الإحالات
- `/api/trpc/earlyAccess.getLeaderboard` - لوحة الصدارة

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
  - `earlyAccessUsers` - المستخدمين المسجلين
  - `earlyAccessReferrals` - الإحالات

### Migration Status
✅ جميع الـ migrations تم تطبيقها بنجاح على Neon database

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

- [x] Frontend deployed على bithrahapp.com
- [x] Domain مربوط بشكل صحيح
- [x] SSL certificate فعّال
- [ ] DATABASE_URL مضاف في Vercel
- [ ] API endpoints تعمل بشكل صحيح
- [ ] Early Access registration يعمل
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

**آخر تحديث:** 2025-11-30
**Version:** 9aacf4b8
