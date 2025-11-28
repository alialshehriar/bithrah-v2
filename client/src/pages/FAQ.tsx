import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-center">الأسئلة الشائعة</h1>
      <p className="text-center text-muted-foreground mb-12">
        إجابات على أكثر الأسئلة شيوعاً حول منصة بذره
      </p>

      <Card className="p-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-right">
              ما هي بذره؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              بذره هي منصة وساطة ذكية تربط أصحاب المشاريع بالداعمين والمستثمرين. نوفر بيئة آمنة للتواصل والتفاوض بدون قروض أو حصص أو نسب ملكية.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-right">
              كيف يختلف نموذج بذره عن منصات التمويل الجماعي الأخرى؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              بذره لا تعتمد على القروض أو الحصص. الدعم يتم عبر باقات دعم فقط، ويمكن للمستثمرين فتح قناة تفاوض مباشرة مع أصحاب المشاريع للاتفاق على أي شكل من أشكال التعاون.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-right">
              ما هو "فك باب التفاوض"؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              هو زر موجود تحت باقات الدعم في صفحة المشروع. عند الضغط عليه، ينفتح قناة خاصة بين المستثمر وصاحب المشروع داخل المنصة للتفاوض بحرية على أي نوع من التعاون (خدمة، شراكة، تمويل، إلخ).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-right">
              هل يمكنني أن أكون صاحب مشروع وداعم ومسوق في نفس الوقت؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              نعم! جميع المستخدمين يمكنهم القيام بجميع الأدوار في حساب واحد. لا يوجد "نوع حساب" محدد.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-right">
              ما هي باقة المستثمر؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              باقة اشتراك توفر مزايا خاصة مثل: فتح باب التفاوض، الوصول المبكر للمشاريع، تنبيهات المشاريع الجديدة، والوصول إلى المشاريع الخاصة المغلقة.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-right">
              كيف تحمي بذره الملكية الفكرية؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              نحمي الأفكار من خلال: (1) إخفاء التفاصيل الحساسة قبل الموافقة على اتفاقية السرية، (2) توثيق جميع التفاعلات والموافقات، (3) توفير أدلة رقمية (سجلات الدخول والاطلاع) في حال حدوث سرقة.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-right">
              هل بذره طرف في الاتفاقات بين المستثمر وصاحب المشروع؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              لا. بذره فقط بيئة آمنة للتواصل. جميع الاتفاقات تتم بين الطرفين مباشرة.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-right">
              كيف يعمل نظام العمولات؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              بذره تحصل على نسبة من باقات الدعم التي يتم شراؤها، ورسوم اشتراك من باقة المستثمر، ونسبة من عمولات المسوقين. العمولات الدقيقة موضحة في كل مشروع.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-right">
              ما هو نظام التسجيل المبكر؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              المستخدمون الذين يسجلون في المرحلة المبكرة يحصلون على مزايا خاصة، بما في ذلك نظام الإحالات الذي يمنح المحيل والمحال اشتراك مستثمر سنوي مجاني عند تسجيل 5 أشخاص.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger className="text-right">
              كيف أنشئ مشروعاً على بذره؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              بعد التسجيل، اذهب إلى "مشاريعي" ← "مشروع جديد". املأ تفاصيل المشروع، حدد باقات الدعم ومزاياها، ثم انشر المشروع.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11">
            <AccordionTrigger className="text-right">
              ما هو وكيل تقييم الأفكار؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              أداة ذكاء اصطناعي تساعدك على تقييم فكرتك قبل نشرها. يحلل الوكيل الفكرة ويقدم تقريراً مفصلاً عن نقاط القوة والضعف والفرص.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12">
            <AccordionTrigger className="text-right">
              هل يمكنني تعديل مشروعي بعد نشره؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              نعم، يمكنك تعديل تفاصيل المشروع وباقات الدعم في أي وقت من لوحة التحكم الخاصة بك.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-13">
            <AccordionTrigger className="text-right">
              كيف أتواصل مع الدعم الفني؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              يمكنك التواصل معنا عبر: info@bithrahapp.com أو من خلال نموذج "تواصل معنا" في الموقع.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-14">
            <AccordionTrigger className="text-right">
              هل بذره متاحة في جميع الدول؟
            </AccordionTrigger>
            <AccordionContent className="text-right">
              نعم، بذره منصة إلكترونية متاحة لجميع المستخدمين حول العالم. لكن بعض المزايا قد تختلف حسب القوانين المحلية.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          لم تجد إجابة لسؤالك؟{" "}
          <a href="mailto:info@bithrahapp.com" className="text-primary hover:underline">
            تواصل معنا
          </a>
        </p>
      </div>
    </div>
  );
}
