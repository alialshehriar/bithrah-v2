# 🚀 دليل النشر - منصة بذرة 2.0

## ✅ الحالة الحالية

- ✅ **المشروع محلياً:** يعمل 100% بشكل ممتاز
- ✅ **GitHub Repository:** https://github.com/alialshehriar/bithrah-v2
- ✅ **Database:** PostgreSQL (Neon) - الجداول تم إنشاؤها بنجاح
- ✅ **Schema:** snake_case (متوافق مع PostgreSQL)

---

## 🎯 الميزات المختبرة والعاملة

### 1. نظام التسجيل المبكر (Early Access)
✅ **API Endpoint:** `/api/trpc/earlyAccess.register`

**مثال على الاستخدام:**
```bash
curl -X POST 'http://localhost:3000/api/trpc/earlyAccess.register?batch=1' \
  -H "Content-Type: application/json" \
  -d '{"0":{"json":{"fullName":"أحمد علي","username":"ahmed_test","email":"ahmed@test.com","mobile":"0501234567","source":"social_media","referralCode":""}}}'
```

**النتيجة:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "fullName": "أحمد علي",
    "email": "ahmed@test.com",
    "username": "ahmed_test",
    "referralCode": "AHME5OFE",
    "referralLink": "https://bithrahapp.com/early-access?ref=AHME5OFE",
    "bonusYears": 1,
    "referralCount": 0
  }
}
```

### 2. نظام تقييم الأفكار بالذكاء الاصطناعي
✅ **API Endpoint:** `/api/trpc/ideas.quickEvaluate`

**مثال على الاستخدام:**
```bash
curl -X POST 'http://localhost:3000/api/trpc/ideas.quickEvaluate?batch=1' \
  -H "Content-Type: application/json" \
  -d '{"0":{"json":{"ideaName":"تطبيق توصيل","ideaDescription":"تطبيق توصيل طلبات المطاعم في المدن الصغيرة"}}}'
```

**النتيجة:** تقييم شامل يتضمن:
- Overall Score: 68/100
- Feasibility: 75/100
- Market: 80/100
- Financial: 60/100
- نقاط القوة والضعف
- المخاطر
- التحليل المالي والسوقي
- استراتيجية النمو

---

## 🔧 متطلبات النشر

### Environment Variables المطلوبة:

```env
# Database (PostgreSQL)
DATABASE_URL_NEW=postgresql://user:pass@host/db

# Authentication
JWT_SECRET=your-jwt-secret-here

# AI Evaluation
OPENAI_API_KEY=sk-...

# Admin Access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password

# OAuth (Manus)
OAUTH_SERVER_URL=https://api.manus.im

# Node Environment
NODE_ENV=production
PORT=3000
```

---

## 📦 خيارات النشر

### Option 1: Render.com (الحالي - يحتاج إعادة ربط)

**الخطوات:**
1. افتح https://dashboard.render.com/web/srv-d4mlr1ggjchc73bcvggg/settings
2. في قسم "Repository":
   - اضغط "Disconnect"
   - اضغط "Connect Repository"
   - اختر `alialshehriar/bithrah-v2`
3. تأكد من Environment Variables (انسخها من الـ service القديم)
4. اضغط "Manual Deploy"

**Build Command:**
```bash
pnpm install --frozen-lockfile && pnpm run build
```

**Start Command:**
```bash
pnpm run start
```

---

### Option 2: Vercel (الأسرع والأسهل)

**الخطوات:**
```bash
# 1. تثبيت Vercel CLI
pnpm i -g vercel

# 2. تسجيل الدخول
vercel login

# 3. Deploy
cd /path/to/bithrah-v2
vercel --prod
```

**ملاحظة:** تأكد من إضافة Environment Variables في Vercel Dashboard.

---

### Option 3: Railway.app (مجاني + PostgreSQL مدمج)

**الخطوات:**
1. افتح https://railway.app
2. اضغط "New Project"
3. اختر "Deploy from GitHub repo"
4. اختر `alialshehriar/bithrah-v2`
5. أضف PostgreSQL plugin
6. أضف Environment Variables
7. Deploy تلقائياً!

---

## 🗄️ قاعدة البيانات

### الجداول الموجودة:

#### 1. `early_access_users`
```sql
CREATE TABLE early_access_users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  username TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  referral_count INTEGER DEFAULT 0 NOT NULL,
  bonus_years INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 2. `early_access_referrals`
```sql
CREATE TABLE early_access_referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER NOT NULL REFERENCES early_access_users(id) ON DELETE CASCADE,
  referred_id INTEGER NOT NULL REFERENCES early_access_users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**ملاحظة:** إذا احتجت إعادة إنشاء الجداول، استخدم السكريبت الموجود في المشروع.

---

## ✅ اختبار بعد النشر

### 1. اختبار الصفحة الرئيسية
```bash
curl -I https://your-domain.com
```

### 2. اختبار Early Access API
```bash
curl -X POST 'https://your-domain.com/api/trpc/earlyAccess.register?batch=1' \
  -H "Content-Type: application/json" \
  -d '{"0":{"json":{"fullName":"Test User","username":"test_user","email":"test@example.com","mobile":"0501234567","source":"test","referralCode":""}}}'
```

### 3. اختبار AI Evaluation API
```bash
curl -X POST 'https://your-domain.com/api/trpc/ideas.quickEvaluate?batch=1' \
  -H "Content-Type: application/json" \
  -d '{"0":{"json":{"ideaName":"Test Idea","ideaDescription":"Test description"}}}'
```

---

## 🐛 استكشاف الأخطاء

### مشكلة: `earlyAccessUsers` table not found

**السبب:** Schema القديم (camelCase) لا يزال موجوداً

**الحل:**
```bash
# تشغيل السكريبت لإعادة إنشاء الجداول
node recreate-tables.mjs
```

### مشكلة: Database connection error

**السبب:** DATABASE_URL_NEW غير موجود أو خاطئ

**الحل:**
1. تأكد من وجود `DATABASE_URL_NEW` في Environment Variables
2. تأكد من أن القيمة تبدأ بـ `postgresql://`

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Logs في منصة الاستضافة
2. تأكد من Environment Variables
3. تأكد من أن Database schema صحيح (snake_case)

---

## 🎉 النتيجة النهائية

✅ **المشروع جاهز للنشر بشكل كامل**
✅ **جميع الميزات مختبرة وتعمل 100%**
✅ **Database schema صحيح ومتوافق**
✅ **GitHub repository جاهز**

**فقط اختر منصة الاستضافة وانشر!** 🚀
