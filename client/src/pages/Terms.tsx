import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">الشروط والأحكام</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. نموذج عمل منصة بذره</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>بذره</strong> هي منصة وساطة ذكية تربط أصحاب المشاريع بالداعمين والمستثمرين.
          </p>
          <p>
            <strong>المبادئ الأساسية:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 mr-6">
            <li>لا قروض</li>
            <li>لا دين</li>
            <li>لا حصص</li>
            <li>لا نسب ملكية</li>
            <li>لا أي التزامات مالية مستقبلية</li>
          </ul>
          <p>
            الدعم يتم عبر <strong>باقات دعم فقط</strong>، كل باقة يحددها صاحب المشروع ويضع مزاياها.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. أنواع المستخدمين</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            جميع المستخدمين يستطيعون أن يكونوا في <strong>حساب واحد</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-6">
            <li><strong>أصحاب مشاريع:</strong> ينشرون مشاريعهم ويحددون باقات الدعم</li>
            <li><strong>داعمين:</strong> يدعمون المشاريع عبر شراء باقات الدعم</li>
            <li><strong>مسوقين:</strong> يسوقون للمشاريع ويحصلون على عمولات</li>
            <li><strong>مستثمرين:</strong> يفتحون باب التفاوض مع أصحاب المشاريع</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            لا يوجد "نوع حساب" محدد - كل مستخدم يمكنه القيام بجميع الأدوار.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. نظام "فك باب التفاوض"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>المستثمر</strong> هو الشخص الذي يفتح باب التفاوض من صفحة المشروع.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">كيف يعمل:</h4>
            <ol className="list-decimal list-inside space-y-2 mr-6">
              <li>زر "فك باب التفاوض" موجود تحت باقات الدعم داخل صفحة المشروع</li>
              <li>عند الضغط عليه، ينفتح <strong>قناة خاصة</strong> بين المستثمر وصاحب المشروع داخل منصة بذره</li>
              <li>الطرفان يتفقان داخل المنصة بحرية على أي نوع من التعاون</li>
              <li>بذره فقط <strong>بيئة آمنة للتواصل</strong> وليست طرفًا في الاتفاق</li>
            </ol>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ ملاحظة مهمة:</p>
            <p className="text-sm">
              "فك باب التفاوض" <strong>لا يعني استثمار مالي تلقائيًا</strong>. هو فقط "فتح قناة تفاوض" تسمح للطرفين بالاتفاق على:
            </p>
            <ul className="list-disc list-inside space-y-1 mr-6 mt-2 text-sm">
              <li>خدمة</li>
              <li>شراكة تنفيذية</li>
              <li>تمويل تشغيلي</li>
              <li>عقد عمل</li>
              <li>اتفاق تعاون</li>
              <li>أو أي شكل آخر من التعاون</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. باقة المستثمر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            للوصول إلى ميزات المستثمر، يجب الاشتراك في <strong>باقة المستثمر</strong>.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">مزايا باقة المستثمر:</h4>
            <ul className="list-disc list-inside space-y-2 mr-6">
              <li><strong>فتح باب التفاوض:</strong> إمكانية فتح قناة خاصة مع أصحاب المشاريع</li>
              <li><strong>الوصول المبكر:</strong> رؤية المشاريع قبل نشرها للعامة</li>
              <li><strong>تنبيهات المشاريع:</strong> إشعارات فورية عند نشر مشاريع جديدة</li>
              <li><strong>ظهور المشاريع الخاصة:</strong> الوصول إلى المشاريع المغلقة والخاصة</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. نظام العمولات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            بذره تحصل على عمولة من:
          </p>
          <ul className="list-disc list-inside space-y-2 mr-6">
            <li><strong>باقات الدعم:</strong> نسبة من كل باقة دعم يتم شراؤها</li>
            <li><strong>باقة المستثمر:</strong> رسوم اشتراك شهرية أو سنوية</li>
            <li><strong>عمولات التسويق:</strong> نسبة من عمولات المسوقين</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            العمولات الدقيقة يتم توضيحها في صفحة كل مشروع وباقة.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. المسؤوليات والالتزامات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">مسؤولية بذره:</h4>
              <ul className="list-disc list-inside space-y-1 mr-6 text-sm">
                <li>توفير منصة آمنة للتواصل</li>
                <li>حماية بيانات المستخدمين</li>
                <li>توثيق التفاعلات والاتفاقات</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold">مسؤولية المستخدمين:</h4>
              <ul className="list-disc list-inside space-y-1 mr-6 text-sm">
                <li>تقديم معلومات صحيحة ودقيقة</li>
                <li>احترام حقوق الملكية الفكرية</li>
                <li>الالتزام باتفاقيات السرية</li>
                <li>عدم استخدام المنصة لأغراض غير قانونية</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ تنبيه:</p>
            <p className="text-sm">
              بذره <strong>ليست طرفًا</strong> في أي اتفاق يتم بين المستثمر وصاحب المشروع. جميع الاتفاقات تتم بين الطرفين مباشرة.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. التعديلات على الشروط</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            تحتفظ بذره بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعار المستخدمين بأي تغييرات جوهرية.
          </p>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
    </div>
  );
}
