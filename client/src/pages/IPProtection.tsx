import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileText, AlertTriangle } from "lucide-react";

export default function IPProtection() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">نظام حماية الملكية الفكرية</h1>
        <p className="text-lg text-muted-foreground">
          نحمي أفكارك ومشاريعك من خلال نظام متكامل للحماية والتوثيق
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            1. الحماية قبل الكشف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            لا يرى المستخدم <strong>تفاصيل المشروع الحساسة</strong> إلا بعد:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-6">
            <li>الموافقة على الشروط والأحكام</li>
            <li>التوقيع على اتفاقية السرية (NDA)</li>
            <li>التسجيل في المنصة بهوية موثقة</li>
          </ul>
          
          <div className="bg-muted p-4 rounded-lg mt-4">
            <h4 className="font-semibold mb-2">ما يتم إخفاؤه قبل الموافقة:</h4>
            <ul className="list-disc list-inside space-y-1 mr-6 text-sm">
              <li>التفاصيل التقنية الكاملة</li>
              <li>خطط التنفيذ والاستراتيجيات</li>
              <li>الأرقام المالية الدقيقة</li>
              <li>معلومات الشركاء والموردين</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            2. اتفاقية السرية (NDA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            كل مستخدم يوافق على:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-6">
            <li><strong>عدم سرقة الأفكار:</strong> الالتزام بعدم استخدام أو نسخ الأفكار المعروضة</li>
            <li><strong>عدم المشاركة:</strong> عدم مشاركة التفاصيل الحساسة مع أطراف ثالثة</li>
            <li><strong>الاستخدام المحدود:</strong> استخدام المعلومات فقط لأغراض التقييم والتفاوض</li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
            <p className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📝 الموافقة الإلكترونية:</p>
            <p className="text-sm">
              الموافقة الإلكترونية على اتفاقية السرية لها <strong>قوة قانونية</strong> ويتم توثيقها بالتاريخ والوقت وعنوان IP.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            3. الأدلة الرقمية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            في حال حدوث سرقة، تزود بذره صاحب الفكرة بـ:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">سجلات الدخول</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mr-6">
                <li>تاريخ ووقت الدخول</li>
                <li>عنوان IP</li>
                <li>نوع الجهاز والمتصفح</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">سجلات الاطلاع</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mr-6">
                <li>الصفحات التي تم زيارتها</li>
                <li>مدة المشاهدة</li>
                <li>التفاصيل التي تم الاطلاع عليها</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">الموافقات</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mr-6">
                <li>نص اتفاقية السرية</li>
                <li>تاريخ ووقت الموافقة</li>
                <li>توقيع إلكتروني</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">التواصل</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mr-6">
                <li>الرسائل المتبادلة</li>
                <li>المحادثات في قناة التفاوض</li>
                <li>الملفات المشاركة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            4. حدود الحماية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ ملاحظة مهمة:</p>
            <p className="text-sm mb-3">
              بذره <strong>ليست جهة تسجيل براءات اختراع</strong> ولا تقدم حماية قانونية رسمية.
            </p>
            <p className="text-sm">
              ما نوفره هو:
            </p>
            <ul className="list-disc list-inside space-y-1 mr-6 mt-2 text-sm">
              <li><strong>حماية مبنية على العقود:</strong> اتفاقيات السرية الموثقة</li>
              <li><strong>السجلات الإلكترونية:</strong> أدلة رقمية يمكن استخدامها قانونياً</li>
              <li><strong>بيئة آمنة:</strong> تقليل فرص السرقة من خلال التحكم في الوصول</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mt-4">
            <p className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ ننصح بـ:</p>
            <ul className="list-disc list-inside space-y-1 mr-6 text-sm">
              <li>تسجيل براءة الاختراع في الجهات الرسمية</li>
              <li>توثيق الملكية الفكرية لدى محامي</li>
              <li>الاحتفاظ بنسخ من جميع المستندات</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. الإجراءات عند الاشتباه بالسرقة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-3 mr-6">
            <li>
              <strong>الإبلاغ الفوري:</strong>
              <p className="text-sm text-muted-foreground mr-6 mt-1">
                إرسال بلاغ مفصل لفريق بذره عبر البريد الإلكتروني أو نموذج الدعم
              </p>
            </li>
            <li>
              <strong>التحقيق الداخلي:</strong>
              <p className="text-sm text-muted-foreground mr-6 mt-1">
                فريق بذره يراجع السجلات والأدلة الرقمية
              </p>
            </li>
            <li>
              <strong>توفير الأدلة:</strong>
              <p className="text-sm text-muted-foreground mr-6 mt-1">
                تزويد صاحب الفكرة بتقرير مفصل يحتوي على جميع السجلات
              </p>
            </li>
            <li>
              <strong>الإجراءات القانونية:</strong>
              <p className="text-sm text-muted-foreground mr-6 mt-1">
                صاحب الفكرة يمكنه استخدام الأدلة في الإجراءات القانونية
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>لأي استفسارات حول حماية الملكية الفكرية، تواصل معنا على: legal@bithrahapp.com</p>
        <p className="mt-2">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
    </div>
  );
}
