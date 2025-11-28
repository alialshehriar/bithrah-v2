# 🔄 إعادة هيكلة المشروع للنشر على Vercel

## الهدف
تحويل المشروع من Express fullstack app إلى Vercel-compatible app مع Serverless Functions

## 🎯 Phase 1: تحليل البنية الحالية
- [ ] تحليل Express server structure في `server/_core/index.ts`
- [ ] تحديد dependencies للـ serverless functions
- [ ] مراجعة OAuth flow الحالي في `server/_core/oauth.ts`
- [ ] تحديد API endpoints المطلوبة (tRPC, OAuth callback)
- [ ] مراجعة database connection setup

## 🔧 Phase 2: إنشاء Vercel Serverless Functions
- [ ] إنشاء `/api/trpc/[trpc].ts` - tRPC handler
- [ ] إنشاء `/api/oauth/callback.ts` - OAuth callback handler
- [ ] تحديث database connection للـ serverless environment
- [ ] نقل server utilities إلى shared modules
- [ ] إضافة environment variables handling

## 🔐 Phase 3: تحديث OAuth Configuration
- [ ] تحديث OAuth redirect URLs لـ Vercel
- [ ] إضافة environment variables في Vercel dashboard
- [ ] اختبار OAuth flow في serverless environment
- [ ] تحديث session management

## 🎨 Phase 4: Frontend & Routing
- [ ] تحديث `vercel.json` للـ SPA routing الصحيح
- [ ] التأكد من build output صحيح (`dist/public`)
- [ ] تحديث API endpoints في frontend (إذا لزم)
- [ ] اختبار client-side routing

## ✅ Phase 5: Testing
- [ ] اختبار محلي شامل
- [ ] اختبار database connections
- [ ] اختبار OAuth flow
- [ ] اختبار جميع الصفحات والميزات
- [ ] اختبار tRPC procedures

## 🚀 Phase 6: Deployment
- [ ] النشر على Vercel
- [ ] التحقق من environment variables
- [ ] اختبار على bithrahapp.com
- [ ] التأكد من جميع الميزات تعمل
- [ ] مراقبة errors والأداء

## 📝 ملاحظات
- المشروع الحالي يعمل 100% على Manus platform
- Vercel يحتاج serverless functions بدلاً من Express server
- OAuth يحتاج redirect URLs جديدة
- Database connections يجب أن تكون serverless-compatible
