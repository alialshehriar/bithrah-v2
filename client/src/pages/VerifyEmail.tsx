import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  // Get token from URL
  const token = new URLSearchParams(window.location.search).get('token');

  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setStatus('success');
      setMessage(data.message);
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      // Redirect to home after 3 seconds
      setTimeout(() => {
        setLocation('/');
      }, 3000);
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('رابط التحقق غير صالح');
      return;
    }

    verifyEmailMutation.mutate({ token });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">جاري التحقق من بريدك الإلكتروني...</h2>
            <p className="text-gray-600">يرجى الانتظار</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-green-600">تم التحقق بنجاح! ✅</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-4">سيتم توجيهك إلى الصفحة الرئيسية خلال ثوانٍ...</p>
            <Button onClick={() => setLocation('/')} className="w-full">
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-600">فشل التحقق ❌</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button onClick={() => setLocation('/')} className="w-full">
                العودة إلى الصفحة الرئيسية
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                إعادة المحاولة
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
