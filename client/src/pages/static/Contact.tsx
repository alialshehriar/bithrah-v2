import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement with trpc.contact.send.useMutation()
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "info@bithrahapp.com",
      link: "mailto:info@bithrahapp.com",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Phone,
      title: "الهاتف",
      value: "+966 50 123 4567",
      link: "tel:+966501234567",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      link: null,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      value: "الأحد - الخميس: 9 صباحاً - 5 مساءً",
      link: null,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const faqs = [
    {
      question: "كيف يمكنني تقييم فكرتي؟",
      answer: "يمكنك تقييم فكرتك مجاناً من خلال صفحة 'تقييم الأفكار' حيث سيقوم نظامنا المدعوم بالذكاء الاصطناعي بتحليل فكرتك وتقديم تقرير شامل.",
    },
    {
      question: "ما هي رسوم المنصة؟",
      answer: "تقييم الأفكار مجاني تماماً. بالنسبة للمشاريع، نأخذ عمولة بسيطة من حملات الدعم الناجحة والتفاوضات الناجحة فقط.",
    },
    {
      question: "كيف أبدأ مشروعي؟",
      answer: "بعد تقييم فكرتك، يمكنك تحويلها إلى مشروع كامل بخطوات بسيطة من خلال منشئ المشاريع.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-700">
              نحن هنا للإجابة على استفساراتك ومساعدتك في رحلتك الريادية
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center card-hover">
                <div className={`inline-flex p-4 rounded-full ${info.bgColor} mb-4`}>
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="font-bold mb-2">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">{info.value}</p>
                )}
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">أرسل رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+966 50 123 4567"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">الموضوع *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    placeholder="ما هو موضوع رسالتك؟"
                  />
                </div>

                <div>
                  <Label htmlFor="message">الرسالة *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-bg"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "جاري الإرسال..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* FAQs */}
            <div>
              <h2 className="text-3xl font-bold mb-6">أسئلة شائعة</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="p-6 card-hover">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold mb-2">{faq.question}</h3>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="font-bold mb-2">لم تجد إجابة لسؤالك؟</h3>
                <p className="text-sm text-gray-600 mb-4">
                  تصفح صفحة الأسئلة الشائعة الكاملة أو تواصل معنا مباشرة
                </p>
                <Button variant="outline" className="w-full">
                  عرض جميع الأسئلة الشائعة
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
