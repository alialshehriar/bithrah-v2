import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Target,
  Eye,
  Heart,
  Users,
  Lightbulb,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Lightbulb,
      title: "الابتكار",
      description: "نؤمن بقوة الأفكار الجديدة ونسعى لتحويلها إلى واقع ملموس",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Shield,
      title: "الشفافية",
      description: "نلتزم بالشفافية الكاملة في جميع تعاملاتنا مع المستخدمين",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Heart,
      title: "الشراكة",
      description: "نبني علاقات طويلة الأمد مبنية على الثقة والاحترام المتبادل",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: TrendingUp,
      title: "النمو",
      description: "نساعد رواد الأعمال على النمو وتحقيق أهدافهم بأفضل الطرق",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const team = [
    {
      name: "علي الشهري",
      role: "المؤسس والرئيس التنفيذي",
      description: "رائد أعمال سعودي متحمس لدعم ريادة الأعمال في العالم العربي",
    },
  ];

  // Removed fake stats - will be replaced with real data from DB

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              من نحن
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              منصة بذرة هي الجسر الذي يربط بين أصحاب الأفكار الرائعة والمستثمرين
              الطموحين، لنبني معاً مستقبل ريادة الأعمال في العالم العربي
            </p>
            <Link href="/ideas/new">
              <Button size="lg" className="gradient-bg">
                ابدأ رحلتك الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-full bg-blue-50">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold">رسالتنا</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                نسعى لتمكين رواد الأعمال من تحويل أفكارهم إلى مشاريع ناجحة من خلال
                توفير منصة متكاملة تجمع بين التقييم الذكي بالذكاء الاصطناعي،
                والدعم الجماعي، والوساطة بين المستثمرين وأصحاب المشاريع. نؤمن
                بأن كل فكرة عظيمة تستحق فرصة للنمو والازدهار.
              </p>
            </Card>

            <Card className="p-8 card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-full bg-purple-50">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold">رؤيتنا</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                أن نكون المنصة الرائدة في العالم العربي لدعم ريادة الأعمال
                والابتكار، حيث يلتقي الإبداع بالفرص، ويتحول الحلم إلى واقع. نطمح
                لبناء مجتمع متكامل من رواد الأعمال والمستثمرين والمسوقين الذين
                يعملون معاً لتحقيق النجاح المشترك.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">قيمنا</h2>
            <p className="text-xl text-gray-600">
              المبادئ التي نؤمن بها ونعمل على تحقيقها كل يوم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center card-hover">
                <div className={`inline-flex p-4 rounded-full ${value.bgColor} mb-4`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section removed - will be replaced with real data from DB */}

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">المؤسس</h2>
            <p className="text-xl text-gray-600">
              قيادة متحمسة لدعم ريادة الأعمال
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="p-8 text-center card-hover">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg text-white">
        <div className="container text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            هل أنت مستعد لتحويل فكرتك إلى واقع؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف رواد الأعمال الذين يثقون في منصة بذرة
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/ideas/new">
              <Button size="lg" variant="secondary">
                قيّم فكرتك مجاناً
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                استكشف المشاريع
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
