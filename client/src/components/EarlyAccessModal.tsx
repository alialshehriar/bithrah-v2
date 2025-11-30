import { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Users, CheckCircle2, Copy, Check } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface EarlyAccessModalProps {
  isOpen: boolean;
}

type TabType = 'register' | 'evaluate' | 'why';

export function EarlyAccessModal({ isOpen }: EarlyAccessModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('register');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [registered, setRegistered] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    source: '',
    referralCode: ''
  });

  // Idea evaluation state
  const [ideaText, setIdeaText] = useState('');
  const [evaluationResult, setEvaluationResult] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const registerMutation = trpc.earlyAccess.register.useMutation();
  const evaluateMutation = trpc.ideas.evaluate.useMutation();

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date('2025-12-29T23:59:59').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await registerMutation.mutateAsync(formData);
      setReferralCode(result.user.referralCode);
      setRegistered(true);
      toast.success('تم التسجيل بنجاح! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء التسجيل');
    }
  };

  const handleEvaluate = async () => {
    if (!ideaText.trim()) {
      toast.error('الرجاء كتابة فكرتك');
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult('');
    
    try {
      // أولاً: إنشاء الفكرة
      const createMutation = trpc.ideas.create.useMutation();
      const createResult = await createMutation.mutateAsync({
        ideaName: 'فكرة من التسجيل المبكر',
        ideaDescription: ideaText
      });
      
      if (!createResult) {
        throw new Error('فشل إنشاء الفكرة');
      }
      
      // ثانياً: تقييم الفكرة
      const result = await evaluateMutation.mutateAsync({
        ideaId: createResult.id
      });
      
      // عرض النتيجة
      const evaluation = `
⭐ التقييم العام: ${result.scores.overall}/100

📈 التفاصيل:
- جدوى التنفيذ: ${result.scores.feasibility}/100
- السوق: ${result.scores.market}/100
- الجدوى المالية: ${result.scores.financial}/100
- التنفيذ: ${result.scores.execution}/100
- النمو: ${result.scores.growth}/100
      `.trim();
      
      setEvaluationResult(evaluation);
      toast.success('تم تقييم فكرتك بنجاح!');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء التقييم');
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('تم نسخ الرابط!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-center">مرحباً بك في بذرة 🌱</h2>
          </div>
          <p className="text-center text-muted-foreground mb-4">
            منصة الوساطة الذكية التي تربط أصحاب الأفكار بالمستثمرين والداعمين
          </p>
          
          {/* Countdown */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4 mb-4">
            <p className="text-center text-sm font-medium mb-2">ينتهي التسجيل المبكر في 29 ديسمبر</p>
            <div className="flex justify-center gap-4">
              <TimeUnit value={timeLeft.days} label="يوم" />
              <TimeUnit value={timeLeft.hours} label="ساعة" />
              <TimeUnit value={timeLeft.minutes} label="دقيقة" />
              <TimeUnit value={timeLeft.seconds} label="ثانية" />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 justify-center">
            <TabButton
              active={activeTab === 'register'}
              onClick={() => setActiveTab('register')}
              icon={<Gift className="w-4 h-4" />}
              label="التسجيل المبكر"
            />
            <TabButton
              active={activeTab === 'evaluate'}
              onClick={() => setActiveTab('evaluate')}
              icon={<Sparkles className="w-4 h-4" />}
              label="قيّم فكرتك"
            />
            <TabButton
              active={activeTab === 'why'}
              onClick={() => setActiveTab('why')}
              icon={<Users className="w-4 h-4" />}
              label="لماذا التسجيل؟"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'register' && (
            <RegisterTab
              registered={registered}
              formData={formData}
              setFormData={setFormData}
              handleRegister={handleRegister}
              isLoading={registerMutation.isPending}
              referralCode={referralCode}
              copyReferralLink={copyReferralLink}
              copied={copied}
            />
          )}
          
          {activeTab === 'evaluate' && (
            <EvaluateTab
              ideaText={ideaText}
              setIdeaText={setIdeaText}
              handleEvaluate={handleEvaluate}
              isEvaluating={isEvaluating}
              evaluationResult={evaluationResult}
            />
          )}
          
          {activeTab === 'why' && <WhyTab />}
        </div>
      </div>
    </div>
  );
}

// Time Unit Component
function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 min-w-[60px] shadow-md">
        <span className="text-2xl font-bold text-primary">{value}</span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// Register Tab
function RegisterTab({ registered, formData, setFormData, handleRegister, isLoading, referralCode, copyReferralLink, copied }: any) {
  if (registered) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">تم التسجيل بنجاح! 🎉</h3>
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 space-y-4">
          <p className="font-medium">رابط الإحالة الخاص بك:</p>
          <div className="flex gap-2">
            <Input
              value={`${window.location.origin}?ref=${referralCode}`}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyReferralLink} variant="outline">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            شارك هذا الرابط مع أصدقائك! كل إحالة ناجحة تمنحك سنة إضافية من اشتراك المستثمر 🎁
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Offer Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 space-y-3">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Gift className="w-5 h-5" />
          🎁 عرض التسجيل المبكر
        </h3>
        <p className="text-sm leading-relaxed">
          سجل الآن لتحصل على <strong>اشتراك مستثمر مجاني لمدة سنة</strong>.
          وأي صديق يأتي عن طريق رابط إحالتك يحصل على سنة،
          وأنت تحصل على <strong>سنة إضافية مقابل كل إحالة ناجحة</strong>.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">الاسم الكامل *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="username">اسم المستخدم *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="username"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="05xxxxxxxx"
            />
          </div>
          
          <div>
            <Label htmlFor="source">كيف سمعت عن بذرة؟</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="تويتر، صديق، إلخ..."
            />
          </div>
          
          <div>
            <Label htmlFor="referralCode">كود الإحالة (اختياري)</Label>
            <Input
              id="referralCode"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              placeholder="أدخل كود الإحالة"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'جاري التسجيل...' : 'سجل الآن'}
        </Button>
      </form>
    </div>
  );
}

// Evaluate Tab
function EvaluateTab({ ideaText, setIdeaText, handleEvaluate, isEvaluating, evaluationResult }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">قيّم فكرتك مجاناً</h3>
        <p className="text-sm text-muted-foreground">
          اكتب فكرتك وسنقوم بتقييمها باستخدام الذكاء الاصطناعي المتقدم
        </p>
      </div>
      
      <div>
        <Label htmlFor="idea">اكتب فكرتك هنا</Label>
        <Textarea
          id="idea"
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          placeholder="اشرح فكرتك بالتفصيل..."
          rows={6}
          className="resize-none"
        />
      </div>
      
      <Button
        onClick={handleEvaluate}
        disabled={isEvaluating || !ideaText.trim()}
        className="w-full"
        size="lg"
      >
        {isEvaluating ? 'جاري التقييم...' : 'قيّم فكرتي'}
      </Button>
      
      {evaluationResult && (
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 space-y-3">
          <h4 className="font-bold text-lg">نتيجة التقييم:</h4>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{evaluationResult}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Why Tab
function WhyTab() {
  const benefits = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'الوصول المبكر للمميزات',
      description: 'كن من أوائل المستخدمين وجرب المميزات الجديدة قبل الجميع'
    },
    {
      icon: <Gift className="w-6 h-6 text-green-500" />,
      title: 'اشتراك مستثمر مجاني',
      description: 'احصل على اشتراك مستثمر بقيمة 1200 ريال مجاناً لمدة سنة كاملة'
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: 'نظام الإحالات والمكافآت',
      description: 'اكسب سنوات إضافية مجانية عن كل صديق تحيله للمنصة'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-purple-500" />,
      title: 'تقييم الأفكار المجاني',
      description: 'احصل على تقييم احترافي لفكرتك باستخدام الذكاء الاصطناعي'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">لماذا التسجيل المبكر؟</h3>
        <p className="text-muted-foreground">
          المنصة مغلقة حالياً ونحن في فترة التسجيل المبكر الحصرية
        </p>
      </div>
      
      <div className="grid gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0">{benefit.icon}</div>
            <div>
              <h4 className="font-bold mb-1">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-medium">
          🚀 لا تفوت الفرصة! سجل الآن وكن جزءاً من مجتمع بذرة
        </p>
      </div>
    </div>
  );
}
