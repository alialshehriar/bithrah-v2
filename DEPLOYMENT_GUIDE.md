# 🚀 دليل النشر على Vercel

## المتطلبات الأساسية
- ✅ حساب Vercel (مجاني): https://vercel.com/signup
- ✅ المشروع موجود على GitHub: https://github.com/alialshehriar/bithrah-v2

---

## خطوات النشر

### 1️⃣ تسجيل الدخول إلى Vercel
1. افتح https://vercel.com
2. سجّل الدخول بحساب GitHub الخاص بك

### 2️⃣ ربط GitHub Repository
1. اضغط على **"Add New Project"**
2. اختر **"Import Git Repository"**
3. ابحث عن `bithrah-v2` أو استخدم الرابط المباشر:
   ```
   https://github.com/alialshehriar/bithrah-v2
   ```
4. اضغط **"Import"**

### 3️⃣ إعدادات المشروع

#### Framework Preset
- اختر: **Vite**

#### Root Directory
- اترك فارغاً (.)

#### Build Command
```bash
pnpm run build
```

#### Output Directory
```bash
dist
```

#### Install Command
```bash
pnpm install
```

### 4️⃣ إضافة Environment Variables

**⚠️ مهم جداً:** يجب إضافة جميع المتغيرات التالية:

```env
# Database
DATABASE_URL_NEW=postgresql://neondb_owner:npg_r6QY5HbMReFP@ep-sweet-lab-af2mj6h6.us-east-2.aws.neon.tech/neondb?sslmode=require

# JWT
JWT_SECRET=<سيتم توليده تلقائياً>

# OAuth (Manus)
VITE_APP_ID=<من Manus>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal

# Built-in APIs
BUILT_IN_FORGE_API_URL=<من Manus>
BUILT_IN_FORGE_API_KEY=<من Manus>
VITE_FRONTEND_FORGE_API_KEY=<من Manus>
VITE_FRONTEND_FORGE_API_URL=<من Manus>

# Owner Info
OWNER_OPEN_ID=<من Manus>
OWNER_NAME=<اسمك>

# SMTP (اختياري - للإشعارات)
SMTP_HOST=<SMTP host>
SMTP_PORT=<SMTP port>
SMTP_USER=<SMTP username>
SMTP_PASS=<SMTP password>
SMTP_FROM_EMAIL=<من بريدك>

# Analytics (اختياري)
VITE_ANALYTICS_ENDPOINT=<من Manus>
VITE_ANALYTICS_WEBSITE_ID=<من Manus>

# App Info
VITE_APP_TITLE=بذرة - منصة الوساطة الذكية
VITE_APP_LOGO=/logo.png
```

**📝 ملاحظة:** يمكنك الحصول على قيم Manus من:
- لوحة تحكم Manus: https://manus.im
- أو من المتغيرات الحالية في المشروع

### 5️⃣ النشر
1. اضغط **"Deploy"**
2. انتظر حتى ينتهي النشر (عادة 2-3 دقائق)
3. ستحصل على رابط مثل: `https://bithrah-v2.vercel.app`

---

## ربط دومين مخصص

### إذا كان لديك دومين (مثل: bithrahapp.com)

1. في Vercel، افتح المشروع
2. اذهب إلى **Settings** → **Domains**
3. أضف دومينك: `bithrahapp.com` و `www.bithrahapp.com`
4. اتبع التعليمات لتحديث DNS records

#### DNS Records المطلوبة:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## اختبار بعد النشر

### ✅ اختبار التسجيل المبكر
1. افتح: `https://your-domain.com/early-access`
2. سجّل مستخدم جديد
3. تحقق من ظهور كود الإحالة

### ✅ اختبار نظام الإحالات
1. انسخ رابط الإحالة من صفحة النجاح
2. افتح الرابط في نافذة خفية (Incognito)
3. سجّل مستخدم جديد
4. تحقق من زيادة عدد الإحالات للمستخدم الأول

### ✅ اختبار لوحة الإدارة
1. افتح: `https://your-domain.com/admin/early-access`
2. سجّل دخول بحساب المالك
3. تحقق من ظهور جميع المستخدمين
4. جرّب تصدير CSV

---

## 🔧 استكشاف الأخطاء

### المشكلة: Build Failed
**الحل:**
- تحقق من Environment Variables
- تأكد من وجود `DATABASE_URL_NEW`

### المشكلة: Database Connection Error
**الحل:**
- تأكد من إضافة `?sslmode=require` في نهاية DATABASE_URL_NEW
- تحقق من صلاحيات قاعدة البيانات

### المشكلة: OAuth لا يعمل
**الحل:**
- تحقق من `VITE_APP_ID` و `OAUTH_SERVER_URL`
- تأكد من إضافة Vercel URL في إعدادات OAuth في Manus

---

## 📊 مراقبة الأداء

بعد النشر، يمكنك مراقبة:
- **Analytics**: عدد الزوار والتسجيلات
- **Logs**: أخطاء وتحذيرات
- **Deployments**: تاريخ النشر

كل هذا متاح في لوحة تحكم Vercel.

---

## 🎉 جاهز للإطلاق!

بعد اكتمال جميع الخطوات:
1. ✅ المشروع منشور على Vercel
2. ✅ الدومين مربوط (اختياري)
3. ✅ جميع الاختبارات نجحت
4. ✅ لوحة الإدارة تعمل

**يمكنك الآن مشاركة الرابط وبدء حملة التسجيل المبكر! 🚀**

---

## 📞 الدعم

إذا واجهت أي مشكلة:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/alialshehriar/bithrah-v2/issues
