"use cleint";

"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/services/auth";
import showToast from "@/utils/showToast";

// تعريف نوع بيانات تسجيل الدخول
type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const [email, setEmail] = useState<LoginFormData["email"]>("");
  const [password, setPassword] = useState<LoginFormData["password"]>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // نوع الحدث هو FormEvent<HTMLFormElement>
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData: LoginFormData = { email, password };
      console.log("Login attempt:", formData);
      const data = await login(formData.email, formData.password);
      console.log("Login successful:", data);
      showToast("success", "تم تسجيل الدخول بنجاح!");
      // إعادة تعيين الحقول بعد تسجيل الدخول الناجح
      setEmail("");
      setPassword("");
      // get the role from data and redirect based on role
    } catch (error) {
      console.error("Login error:", error);
      showToast(
        "error",
        "فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
        radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(217, 119, 6, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, 
          rgba(34, 197, 94, 0.05) 0%, 
          rgba(255, 255, 255, 0.8) 50%, 
          rgba(217, 119, 6, 0.03) 100%)
      `,
      }}
    >
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <CardHeader className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            مرحبا بك في منصة المدرسة القرآنية
          </p>
        </CardHeader>

        <CardContent>
          {/* استعمل form مباشرة مع onSubmit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
                dir="rtl"
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  style={{ left: "12px", right: "auto" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full bg-green-600 hover:bg-amber-500 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin "/> : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-6">
            <button className="w-full text-center text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium transition-colors">
              نسيت كلمة السر؟
            </button>
          </div>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
              أو
            </span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ليس لديك حساب؟{" "}
              <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors">
                إنشاء حساب جديد
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
