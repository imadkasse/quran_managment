"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Phone,
} from "lucide-react";
import { AddParentFormData } from "@/types/types";
import showToast from "@/utils/showToast";
import { useUser } from "@/store/userStore";

// Types

interface AddParentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onAddParent: (data: AddParentFormData) => Promise<void>;
}

// Password Generator Function
const generatePassword = (length: number = 12): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Password Strength Calculator
const getPasswordStrength = (
  password: string
): { strength: string; color: string } => {
  if (password.length === 0) return { strength: "", color: "" };
  if (password.length < 6)
    return { strength: "ضعيفة", color: "text-destructive" };
  if (password.length < 10)
    return { strength: "متوسطة", color: "text-yellow-500" };
  return { strength: "قوية", color: "text-green-500" };
};

export default function AddParentModal({
  open,
  onOpenChange,
  onAddParent,
}: AddParentModalProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<AddParentFormData>({
    username: "",
    email: "",
    password: "",
    teacher_id: user?.id || "",
    num_phone: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<Partial<AddParentFormData>>({});

  // Validate Form
  // const validateForm = (): boolean => {
  //   const newErrors: Partial<AddParentFormData> = {};

  //   if (!formData.username.trim()) {
  //     newErrors.username = "اسم المستخدم مطلوب";
  //   } else if (formData.username.length < 3) {
  //     newErrors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
  //   }

  //   if (!formData.email.trim()) {
  //     newErrors.email = "البريد الإلكتروني مطلوب";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  //     newErrors.email = "البريد الإلكتروني غير صالح";
  //   }

  //   if (!formData.password) {
  //     newErrors.password = "كلمة المرور مطلوبة";
  //   } else if (formData.password.length < 6) {
  //     newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onAddParent(formData);

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        teacher_id: "",
        num_phone: null,
      });
      setErrors({});
      onOpenChange(false);
      showToast("success", "تم إضافة الولي بنجاح");
    } catch (error: any) {
      const err = error as Error;

      console.log(error);
      showToast("error", err.message || "حدث خطأ أثناء إضافة الولي");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Generate Password
  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData({ ...formData, password: newPassword });
    setErrors({ ...errors, password: "" });
  };

  // Handle Input Change
  const handleChange = (field: keyof AddParentFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground text-2xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            إضافة ولي جديد
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            قم بإدخال معلومات ولي الأمر الجديد. جميع الحقول مطلوبة.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground font-medium">
              اسم المستخدم
            </Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={`pr-10 border-border focus:ring-primary ${
                  errors.username ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`pr-10 border-border focus:ring-primary ${
                  errors.email ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="num_phone" className="text-foreground font-medium">
              رقم الهاتف
            </Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="num_phone"
                type="tel"
                placeholder="0661234567"
                value={formData.num_phone || ""}
                onChange={(e) => handleChange("num_phone", e.target.value)}
                className={`pr-10 border-border focus:ring-primary ${
                  errors.email ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.num_phone && (
              <p className="text-sm text-destructive">{errors.num_phone}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              كلمة المرور
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pr-10 pl-10 border-border focus:ring-primary ${
                    errors.password ? "border-destructive" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGeneratePassword}
                disabled={isLoading}
                className="gap-2 px-3"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              {errors.password ? (
                <p className="text-destructive">{errors.password}</p>
              ) : (
                <p className="text-muted-foreground">
                  {formData.password.length} حرف
                </p>
              )}
              {passwordStrength.strength && (
                <p className={`font-medium ${passwordStrength.color}`}>
                  {passwordStrength.strength}
                </p>
              )}
            </div>
          </div>
        </form>

        <DialogFooter className="gap-2" dir="ltr">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                حفظ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
