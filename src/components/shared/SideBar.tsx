"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Bell,
  GraduationCap,
  Moon,
  Sun,
  Menu,
  X,
  UserStar,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";
import useTheme from "@/hooks/useTheme";
import Link from "next/link";
import { useUser } from "@/store/userStore";
import { Database } from "@/types/supabase.types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface RoleConfig {
  label: string;
  items: NavItem[];
  color: string;
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  ADMIN: {
    label: "مدير النظام",
    color: "var(--chart-1)",
    items: [
      { title: "لوحة التحكم", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "إدارة المستخدمين", href: "/admin/users", icon: Users },
    ],
  },
  TEACHER: {
    label: "معلم",
    color: "var(--chart-2)",
    items: [
      {
        title: "لوحة التحكم",
        href: "/teacher/dashboard",
        icon: LayoutDashboard,
      },
      { title: "الطلاب", href: "/teacher/students", icon: GraduationCap },
      { title: "الأولياء", href: "/teacher/parents", icon: UserStar },
      { title: "الحضور", href: "/teacher/attendance", icon: UserCheck },
      { title: "التقدم", href: "/teacher/evaluations", icon: TrendingUp },
      { title: "الإشتراكات", href: "/teacher/subscriptions", icon: CreditCard },
      { title: "التقارير", href: "/teacher/reports", icon: FileText },
      { title: "الإشعارات", href: "/teacher/notifications", icon: Bell },
    ],
  },
  PARENT: {
    label: "ولي أمر",
    color: "var(--chart-3)",
    items: [
      {
        title: "لوحة التحكم",
        href: "/parent/dashboard",
        icon: LayoutDashboard,
      },
      { title: "الأطفال", href: "/parent/students", icon: GraduationCap },
      { title: "الحضور", href: "/parent/attendance", icon: UserCheck },
      { title: "التقارير", href: "/parent/reports", icon: FileText },
      { title: "الإشعارات", href: "/parent/notifications", icon: Bell },
    ],
  },
  SUPERADMIN: {
    label: "ولي أمر",
    color: "var(--chart-4)",
    items: [
      {
        title: "لوحة التحكم",
        href: "/parent/dashboard",
        icon: LayoutDashboard,
      },
      { title: "الأطفال", href: "/parent/students", icon: GraduationCap },
      { title: "الحضور", href: "/parent/attendance", icon: UserCheck },
      { title: "التقارير", href: "/parent/reports", icon: FileText },
      { title: "الإشعارات", href: "/parent/notifications", icon: Bell },
    ],
  },
};

const SideBar: React.FC = () => {
  const { user } = useUser();
  
  const currentConfig = roleConfigs[user?.role as UserRole || "TEACHER"];
  
  const router = useRouter();
  const pathName = usePathname();
  const [activeLink, setActiveLink] = useState(pathName);

  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
    setIsMobileOpen(false);
    router.push(href);
  };

  return (
    <div className=" h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex h-screen">
        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="sticky top-4 right-4 z-50 lg:hidden m-4"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Sidebar */}
        <aside
          className={`
          w-80 bg-[var(--sidebar)] border-l border-[var(--sidebar-border)] 
          flex flex-col shadow-lg transition-transform duration-300 ease-in-out z-50 
          ${
            isMobileOpen
              ? "translate-x-0 "
              : "translate-x-full lg:translate-x-0"
          }
          fixed lg:relative h-full
        `}
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--sidebar-border)]">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentConfig.color}, var(--sidebar-accent))`,
                }}
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--sidebar-foreground)]">
                  نظام المدرسة
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  منصة التعليم الذكية
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  {currentConfig.label}
                </h3>
              </div>

              {currentConfig.items.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeLink === item.href;

                return (
                  <Link
                    href={item.href}
                    key={index}
                    // onClick={() => handleLinkClick(item.href)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-in-out group relative overflow-hidden
                      ${
                        isActive
                          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-md"
                          : "text-[var(--sidebar-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] hover:-translate-x-1"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-current" : "group-hover:text-current"
                      }`}
                    />
                    <span className="flex-1 text-right">{item.title}</span>

                    {isActive && (
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l"
                        style={{ backgroundColor: currentConfig.color }}
                      />
                    )}

                    {/* Hover effect */}
                    <div
                      className={`
                      absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200
                      bg-gradient-to-l from-transparent to-current
                    `}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--sidebar-border)]">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-center gap-2 bg-transparent border-[var(--sidebar-border)] hover:bg-[var(--muted)] transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              {isDarkMode ? "الوضع الفاتح" : "الوضع المظلم"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SideBar;
