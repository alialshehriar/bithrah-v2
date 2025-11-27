import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      category: "عام",
      questions: [
        {
          question: "ما هي منصة بذرة؟",
          answer:
            "بذرة هي منصة متكاملة تجمع بين تقييم الأفكار بالذكاء الاصطناعي، والدعم الجماعي، والوساطة بين المستثمرين وأصحاب المشاريع. نهدف إلى تمكين رواد الأعمال من تحويل أفكارهم إلى مشاريع ناجحة.",
        },
        {
          question: "كيف يمكنني التسجيل في المنصة؟",
          answer:
            "يمكنك التسجيل بسهولة من خلال زر 'تسجيل الدخول' في الصفحة الرئيسية. نوفر عدة خيارات للتسجيل بما في ذلك Google و Apple و Microsoft.",
        },
        {
          question: "هل المنصة مجانية؟",
          answer:
            "نعم، التسجيل وتقييم الأفكار مجاني تماماً. نأخذ عمولة بسيطة فقط من حملات الدعم الناجحة والتفاوضات الناجحة للمشاريع.",
        },
      ],
    },
    {
      category: "تقييم الأفكار",
      questions: [
        {
          question: "كيف يعمل نظام تقييم الأفكار؟",
          answer:
            "نستخدم نموذج GPT-4 المتقدم لتحليل فكرتك من 8 جوانب رئيسية: الابتكار، إمكانات السوق، قابلية التنفيذ، قابلية التوسع، الربحية، المنافسة، المخاطر، والاستدامة. ستحصل على تقرير شامل مع تحليل SWOT وتوصيات عملية.",
        },
        {
          question: "كم يستغرق تقييم الفكرة؟",
          answer:
            "عادةً ما يستغرق التقييم بين 30 ثانية إلى دقيقتين، حسب تعقيد الفكرة وحجم المعلومات المقدمة.",
        },
        {
          question: "هل يمكنني تقييم أكثر من فكرة؟",
          answer:
            "نعم، يمكنك تقييم عدد غير محدود من الأفكار. نشجع على تقييم أفكار متعددة لاختيار الأفضل.",
        },
        {
          question: "هل بياناتي آمنة؟",
          answer:
            "نعم، نحن نأخذ الخصوصية والأمان على محمل الجد. جميع بياناتك مشفرة ولن نشاركها مع أي طرف ثالث دون إذنك.",
        },
      ],
    },
    {
      category: "المشاريع",
      questions: [
        {
          question: "كيف أحول فكرتي إلى مشروع؟",
          answer:
            "بعد تقييم فكرتك، ستجد زر 'تحويل إلى مشروع' في صفحة نتائج التقييم. سيرشدك منشئ المشاريع خلال 6 خطوات لإنشاء مشروعك الكامل.",
        },
        {
          question: "ما هي أنواع المشاريع المدعومة؟",
          answer:
            "ندعم جميع أنواع المشاريع في مختلف المجالات: التقنية، التعليم، الصحة، التجارة الإلكترونية، الخدمات، الصناعة، وغيرها.",
        },
        {
          question: "كيف يعمل نظام الدعم؟",
          answer:
            "نوفر نظام دعم جماعي حيث يمكن للمستثمرين دعم مشروعك مقابل مكافآت أو حصص. يمكنك تحديد هدف الدعم والمدة الزمنية والباقات المختلفة.",
        },
        {
          question: "ما هي رسوم المنصة؟",
          answer:
            "نأخذ عمولة 5% من حملات الدعم الناجحة والتفاوضات الناجحة فقط. لا توجد رسوم مقدمة أو رسوم شهرية.",
        },
      ],
    },
    {
      category: "الاستثمار",
      questions: [
        {
          question: "كيف يمكنني الاستثمار في المشاريع؟",
          answer:
            "يمكنك تصفح المشاريع المتاحة واختيار المشروع المناسب، ثم اختيار باقة الدعم أو التواصل مع صاحب المشروع للتفاوض على حصة.",
        },
        {
          question: "ما هي الحد الأدنى للاستثمار؟",
          answer:
            "يختلف الحد الأدنى حسب كل مشروع وباقة الدعم. بعض المشاريع تبدأ من 100 ريال.",
        },
        {
          question: "كيف أحمي استثماري؟",
          answer:
            "نوفر نظام وساطة آمن وشفاف. جميع المعاملات موثقة، ونوفر عقود قانونية واضحة لحماية حقوق المستثمرين.",
        },
        {
          question: "متى أحصل على عوائد استثماري؟",
          answer:
            "يعتمد ذلك على نوع الاستثمار والاتفاق مع صاحب المشروع. بعض المكافآت فورية، وبعضها يتم تسليمها بعد إنجاز المشروع.",
        },
      ],
    },
    {
      category: "التسويق والعمولات",
      questions: [
        {
          question: "كيف يعمل نظام التسويق بالعمولة؟",
          answer:
            "يمكنك الحصول على رابط إحالة فريد ومشاركته. ستحصل على عمولة من كل عملية دعم ناجحة تتم عبر رابطك. نسب العمولة تتراوح بين 2% إلى 5%.",
        },
        {
          question: "كيف أسحب أرباحي؟",
          answer:
            "يمكنك طلب سحب أرباحك من لوحة المسوّق عندما يصل رصيدك إلى الحد الأدنى (500 ريال). نوفر عدة طرق للسحب.",
        },
        {
          question: "متى أحصل على عمولتي؟",
          answer:
            "تُحتسب العمولة فور نجاح عملية الدعم، ويمكنك سحبها بعد 14 يوم عمل.",
        },
      ],
    },
    {
      category: "الاشتراكات",
      questions: [
        {
          question: "ما هي أنواع الاشتراكات المتاحة؟",
          answer:
            "نوفر 4 أنواع: مجاني، فضي (99 ر.س/شهر)، ذهبي (199 ر.س/شهر)، وبلاتيني (399 ر.س/شهر). كل اشتراك يوفر مزايا إضافية.",
        },
        {
          question: "ما الفرق بين الاشتراكات؟",
          answer:
            "الاشتراكات الأعلى توفر: إشعارات مبكرة للمشاريع، وصول لمجتمعات حصرية، تحليلات متقدمة بالذكاء الاصطناعي، أولوية في التواصل، وخصومات على رسوم التفاوض.",
        },
        {
          question: "هل يمكنني إلغاء اشتراكي؟",
          answer:
            "نعم، يمكنك إلغاء اشتراكك في أي وقت من صفحة الإعدادات. ستستمر المزايا حتى نهاية الفترة المدفوعة.",
        },
      ],
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              إجابات على أكثر الأسئلة شيوعاً حول منصة بذرة
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="ابحث عن سؤالك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 py-6 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container max-w-4xl">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQs.map((category, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, qIndex) => (
                      <AccordionItem
                        key={qIndex}
                        value={`${index}-${qIndex}`}
                        className="border rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-right hover:no-underline">
                          <span className="font-bold">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">لم نجد نتائج</h3>
              <p className="text-gray-600 mb-6">
                لم نجد أي أسئلة تطابق بحثك. جرب كلمات مختلفة أو تواصل معنا مباشرة
              </p>
              <Link href="/contact">
                <Button>
                  <MessageSquare className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
              </Link>
            </Card>
          )}

          {/* CTA */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-blue-50 to-purple-50 text-center">
            <h3 className="text-2xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h3>
            <p className="text-gray-600 mb-6">
              فريقنا جاهز لمساعدتك والإجابة على جميع استفساراتك
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gradient-bg">
                  <MessageSquare className="w-5 h-5 ml-2" />
                  تواصل معنا
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  تعرف علينا أكثر
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
