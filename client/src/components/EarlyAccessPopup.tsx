import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Copy, Check, Sparkles, Lightbulb, Gift } from "lucide-react";
import { toast } from "sonner";

export function EarlyAccessPopup() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [copied, setCopied] = useState(false);
  
  // Registration form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [registered, setRegistered] = useState(false);
  const [userReferralCode, setUserReferralCode] = useState("");
  
  // Idea evaluation form
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);
  
  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const registerMutation = trpc.earlyAccess.register.useMutation();
  
  // Check if already registered
  useEffect(() => {
    const registeredEmail = localStorage.getItem("earlyAccessEmail");
    const savedReferralCode = localStorage.getItem("earlyAccessReferralCode");
    
    if (registeredEmail && savedReferralCode) {
      setRegistered(true);
      setEmail(registeredEmail);
      setUserReferralCode(savedReferralCode);
    } else {
      // Show popup after 2 seconds
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Get referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref);
    }
  }, []);
  
  // Countdown timer
  useEffect(() => {
    const targetDate = new Date("2024-12-29T00:00:00").getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRegister = async () => {
    if (!name || !email) {
      toast.error("الرجاء إدخال الاسم والبريد الإلكتروني");
      return;
    }
    
    try {
      const result = await registerMutation.mutateAsync({
        fullName: name,
        email,
        username: email.split('@')[0], // Generate username from email
        source: 'popup',
        phone: phone || undefined,
        referralCode: referralCode || undefined,
      });
      
      setRegistered(true);
      setUserReferralCode(result.user.referralCode);
      localStorage.setItem("earlyAccessEmail", email);
      localStorage.setItem("earlyAccessReferralCode", result.user.referralCode);
      
      toast.success("تم التسجيل بنجاح! 🎉");
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء التسجيل");
    }
  };
  
  const handleCopyReferralLink = () => {
    const link = `${window.location.origin}?ref=${userReferralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("تم نسخ رابط الإحالة!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleIdeaSubmit = () => {
    if (!ideaTitle || !ideaDescription) {
      toast.error("الرجاء إدخال عنوان الفكرة ووصفها");
      return;
    }
    
    // TODO: Integrate with AI idea evaluation
    setIdeaSubmitted(true);
    toast.success("تم استلام فكرتك! سنقوم بتقييمها قريباً.");
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">🌱 مرحباً بك في بذرة!</h2>
            <p className="text-muted-foreground">
              منصة الوساطة الذكية التي تربط أصحاب الأفكار بالمستثمرين والداعمين
            </p>
          </div>
          
          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6 text-center">
            <p className="text-sm font-medium mb-3">الإطلاق الرسمي خلال</p>
            <div className="flex justify-center gap-4 dir-ltr">
              <div className="bg-background rounded-lg p-3 min-w-[70px]">
                <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
                <div className="text-xs text-muted-foreground mt-1">يوم</div>
              </div>
              <div className="bg-background rounded-lg p-3 min-w-[70px]">
                <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-xs text-muted-foreground mt-1">ساعة</div>
              </div>
              <div className="bg-background rounded-lg p-3 min-w-[70px]">
                <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-xs text-muted-foreground mt-1">دقيقة</div>
              </div>
              <div className="bg-background rounded-lg p-3 min-w-[70px]">
                <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-xs text-muted-foreground mt-1">ثانية</div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="register">
                <Gift className="w-4 h-4 ml-2" />
                التسجيل المبكر
              </TabsTrigger>
              <TabsTrigger value="evaluate">
                <Lightbulb className="w-4 h-4 ml-2" />
                قيّم فكرتك
              </TabsTrigger>
              <TabsTrigger value="why">
                <Sparkles className="w-4 h-4 ml-2" />
                لماذا التسجيل؟
              </TabsTrigger>
            </TabsList>
            
            {/* Tab 1: Registration */}
            <TabsContent value="register" className="space-y-4">
              {!registered ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    
                    {referralCode && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-sm text-green-600 dark:text-green-400">
                          ✨ تم استخدام كود الإحالة: <span className="font-mono font-bold">{referralCode}</span>
                        </p>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleRegister}
                      disabled={registerMutation.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري التسجيل...
                        </>
                      ) : (
                        "سجّل الآن مجاناً 🚀"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-center py-6">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold">تم التسجيل بنجاح! 🎉</h3>
                  <p className="text-muted-foreground">
                    شكراً لانضمامك إلى بذرة. سنرسل لك تحديثات الإطلاق على بريدك الإلكتروني.
                  </p>
                  
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                    <p className="font-medium">رابط الإحالة الخاص بك:</p>
                    <div className="flex gap-2">
                      <Input
                        value={`${window.location.origin}?ref=${userReferralCode}`}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        onClick={handleCopyReferralLink}
                        variant="outline"
                        size="icon"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      شارك هذا الرابط مع أصدقائك واحصل على مزايا حصرية عند الإطلاق!
                    </p>
                  </div>
                  
                  <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
                    استكشف المنصة
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Tab 2: Idea Evaluation */}
            <TabsContent value="evaluate" className="space-y-4">
              {!ideaSubmitted ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    لديك فكرة مشروع؟ احصل على تقييم مجاني بالذكاء الاصطناعي!
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ideaTitle">عنوان الفكرة *</Label>
                      <Input
                        id="ideaTitle"
                        value={ideaTitle}
                        onChange={(e) => setIdeaTitle(e.target.value)}
                        placeholder="مثال: تطبيق توصيل طعام صحي"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ideaDescription">وصف الفكرة *</Label>
                      <Textarea
                        id="ideaDescription"
                        value={ideaDescription}
                        onChange={(e) => setIdeaDescription(e.target.value)}
                        placeholder="اشرح فكرتك بالتفصيل..."
                        rows={6}
                      />
                    </div>
                    
                    <Button onClick={handleIdeaSubmit} className="w-full" size="lg">
                      <Lightbulb className="w-4 h-4 ml-2" />
                      قيّم فكرتي الآن
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 text-center py-6">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                    <Lightbulb className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold">تم استلام فكرتك! 💡</h3>
                  <p className="text-muted-foreground">
                    سنقوم بتقييم فكرتك باستخدام الذكاء الاصطناعي وإرسال النتائج إلى بريدك الإلكتروني قريباً.
                  </p>
                  <Button onClick={() => setIdeaSubmitted(false)} variant="outline">
                    قيّم فكرة أخرى
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Tab 3: Why Register Early */}
            <TabsContent value="why" className="space-y-4">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">مزايا حصرية للمسجلين الأوائل</h4>
                    <p className="text-sm text-muted-foreground">
                      احصل على وصول مبكر للمنصة وميزات خاصة غير متاحة للآخرين
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">خصومات على رسوم المنصة</h4>
                    <p className="text-sm text-muted-foreground">
                      استمتع بخصومات تصل إلى 50% على رسوم الوساطة لأول 6 أشهر
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">أولوية في عرض المشاريع</h4>
                    <p className="text-sm text-muted-foreground">
                      مشاريعك ستظهر في المقدمة وتحصل على رؤية أكبر من المستثمرين
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">استشارات مجانية</h4>
                    <p className="text-sm text-muted-foreground">
                      احصل على جلسة استشارية مجانية مع خبراء ريادة الأعمال
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">نظام الإحالات المجزي</h4>
                    <p className="text-sm text-muted-foreground">
                      اربح مكافآت عن كل صديق تدعوه للانضمام إلى المنصة
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setActiveTab("register")}
                  className="w-full"
                  size="lg"
                >
                  سجّل الآن واحصل على المزايا! 🎉
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
