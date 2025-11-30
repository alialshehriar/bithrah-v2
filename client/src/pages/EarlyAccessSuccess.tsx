import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Copy, Share2, Users, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EarlyAccessSuccess() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const savedUserData = localStorage.getItem('early_access_user');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    } else {
      // If no user data, redirect to home
      setLocation('/');
    }
  }, []);

  const referralLink = userData 
    ? `${window.location.origin}/?ref=${userData.referralCode}`
    : '';

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('تم نسخ رابط الإحالة!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'انضم إلى بذرة',
          text: `انضم إلى منصة بذرة باستخدام كود الإحالة الخاص بي واحصل على مزايا حصرية!`,
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyReferralLink();
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">مبروك! 🎉</h1>
            <p className="text-gray-600 text-lg">
              تم تسجيلك بنجاح في التسجيل المبكر لمنصة بذرة
            </p>
          </div>

          {/* User Info */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              معلوماتك
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">الاسم:</span> {userData.fullName}</p>
              <p><span className="font-semibold">اسم المستخدم:</span> @{userData.username}</p>
              <p><span className="font-semibold">البريد الإلكتروني:</span> {userData.email}</p>
              <p><span className="font-semibold">سنوات الاشتراك المجاني:</span> {userData.bonusYears} سنة</p>
            </div>
          </div>

          {/* Referral Section */}
          <div className="bg-white border-2 border-primary/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              ادعُ أصدقاءك واحصل على مزايا إضافية
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">كود الإحالة الخاص بك:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 font-mono text-lg font-bold text-primary">
                  {userData.referralCode}
                </code>
                <Button onClick={copyReferralLink} variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">رابط الإحالة الخاص بك:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 text-sm"
                />
                <Button onClick={copyReferralLink} variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button onClick={shareReferralLink} variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">كيف تحصل على سنوات إضافية؟</h3>
                  <p className="text-sm text-blue-800">
                    عندما يسجل صديقك باستخدام كود الإحالة الخاص بك، ستحصل على <strong>سنة إضافية</strong> من الاشتراك المجاني!
                  </p>
                  <p className="text-sm text-blue-800 mt-2">
                    حالياً لديك: <strong>{userData.bonusYears} سنة</strong> من الاشتراك المجاني
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setLocation('/leaderboard')} variant="outline" className="flex-1">
              <Trophy className="w-4 h-4 ml-2" />
              شاهد لوحة الصدارة
            </Button>
            <Button onClick={() => setLocation('/')} className="flex-1">
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
