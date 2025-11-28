import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<string[]>([]);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem("auth_token", data.token);
      
      // Redirect to home
      setLocation("/");
      window.location.reload(); // Reload to update auth state
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const checkPasswordStrength = (password: string) => {
    const checks: string[] = [];
    if (password.length >= 8) checks.push("8 أحرف على الأقل");
    if (/[a-z]/.test(password)) checks.push("حرف صغير");
    if (/[A-Z]/.test(password)) checks.push("حرف كبير");
    if (/[0-9]/.test(password)) checks.push("رقم");
    setPasswordStrength(checks);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "password") {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      username: formData.username || undefined,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="بذره" className="h-16" />
          </div>
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription>
            أدخل بياناتك لإنشاء حساب في بذره
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل *</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="أحمد محمد"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pr-10"
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pr-10"
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم (اختياري)</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="ahmad_m"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="pr-10"
                  disabled={registerMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pr-10"
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
              {formData.password && (
                <div className="space-y-1 text-xs">
                  {["8 أحرف على الأقل", "حرف صغير", "حرف كبير", "رقم"].map((check) => (
                    <div
                      key={check}
                      className={`flex items-center gap-2 ${
                        passwordStrength.includes(check)
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {check}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="pr-10"
                  disabled={registerMutation.isPending}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                "إنشاء حساب"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
