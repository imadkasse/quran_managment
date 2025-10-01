// components/Notifications.tsx

"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Info,
  AlertTriangle,
  BellRing,
  Trash2,
  MoreVertical,
  MailOpen,
  Mail,
} from "lucide-react";

// -----------------------------------------------------------------------------
// 1. تعريف الأنواع (Types)
// -----------------------------------------------------------------------------
type UserRole = "TEACHER" | "PARENT" | "ADMIN";
type NotificationType = "INFO" | "WARNING" | "ALERT";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string; // ISO 8601 string
  user_id: string | "ALL"; // 'ALL' تعني إشعار عام للجميع
}

// -----------------------------------------------------------------------------
// 2. Mock Data والثوابت
// -----------------------------------------------------------------------------

const MOCK_USER = {
  role: "PARENT" as UserRole, // <--- يمكن تغيير الدور للاختبار
  user_id: "t1",
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n001", title: "تذكير: بدء العام الدراسي", message: "سيتم بدء العام الدراسي غدًا، يرجى الاستعداد.", type: "INFO", is_read: false, created_at: "2025-09-30T10:00:00Z", user_id: "ALL" },
  { id: "n002", title: "رسالة من الإدارة", message: "مواعيد اختبارات الصف الخامس تم تغييرها.", type: "WARNING", is_read: false, created_at: "2025-10-01T08:30:00Z", user_id: "t1" },
  { id: "n003", title: "مشكلة في نظام الحضور", message: "تم تسجيل غياب خاطئ للطالب (s001)، يرجى التحقق.", type: "ALERT", is_read: true, created_at: "2025-10-01T09:15:00Z", user_id: "t1" },
  { id: "n004", title: "ملاحظة حول الواجب", message: "تم تقييم واجبات ابنتك سارة.", type: "INFO", is_read: false, created_at: "2025-10-01T11:00:00Z", user_id: "p1" },
  { id: "n005", title: "اجتماع طارئ للمعلمين", message: "اجتماع لمناقشة التغييرات الجديدة في المنهج.", type: "ALERT", is_read: false, created_at: "2025-10-01T12:15:00Z", user_id: "t2" },
];

const NOTIFICATION_CONFIGS: Record<NotificationType, { label: string; color: string; Icon: React.ElementType }> = {
  INFO: { label: "إعلام", color: "bg-primary/10 text-primary", Icon: Info },
  WARNING: { label: "تحذير", color: "bg-secondary/10 text-secondary", Icon: AlertTriangle },
  ALERT: { label: "تنبيه", color: "bg-destructive/10 text-destructive", Icon: BellRing },
};

// -----------------------------------------------------------------------------
// مكون بطاقة الإشعار (Notification Card)
// -----------------------------------------------------------------------------

const NotificationCard: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isActionable: boolean;
}> = ({ notification, onMarkAsRead, onDelete, isActionable }) => {
  const config = NOTIFICATION_CONFIGS[notification.type];
  const Icon = config.Icon;

  // تنسيق خاص للإشعارات غير المقروءة
  const unreadClass = notification.is_read
    ? "bg-card hover:bg-muted/50"
    : "bg-accent/10 hover:bg-accent/20 border-l-4 border-primary dark:border-primary";

  // تنسيق التاريخ
  const formattedDate = new Date(notification.created_at).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className={`transition-all duration-200 shadow-md rounded-lg ${unreadClass}`}>
      <CardContent className="p-4 flex gap-4">
        {/* أيقونة نوع الإشعار */}
        <div className={`p-3 rounded-full h-fit ${config.color.replace('text-', 'bg-')}`}>
          <Icon className={`h-5 w-5 ${config.color.replace('bg-', 'text-')}`} />
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold truncate">
              {notification.title}
              <Badge className={`mr-2 h-5 text-xs font-medium ${config.color}`}>
                {config.label}
              </Badge>
            </CardTitle>
            <span className="text-xs text-muted-foreground ml-4 shrink-0">
              {formattedDate}
            </span>
          </div>
          <p className="text-sm text-foreground/80 mt-1 break-words">
            {notification.message}
          </p>
        </div>

        {/* الإجراءات (للمعلم والادمن فقط) */}
        {isActionable && (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {!notification.is_read && (
                <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)} className="text-primary hover:bg-primary/10">
                  <MailOpen className="h-4 w-4 ml-2" />
                  تمييز كمقروء
                </DropdownMenuItem>
              )}
              {notification.is_read && (
                 <DropdownMenuItem disabled>
                    <Mail className="h-4 w-4 ml-2" />
                    تم القراءة
                 </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 ml-2" />
                حذف الإشعار
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
};

// -----------------------------------------------------------------------------
// 3. المكون الرئيسي: Notifications
// -----------------------------------------------------------------------------

const NotificationsPage: React.FC = () => {
  const { role, user_id } = MOCK_USER;
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  // تحديد ما إذا كان الدور الحالي يمكنه التعديل/الحذف
  const isActionable = role === "TEACHER" || role === "ADMIN";

  // 1. تصفية الإشعارات حسب الدور
  const filteredNotifications = useMemo(() => {
    // ADMIN: يرى الجميع
    if (role === "ADMIN") {
      return notifications;
    }
    // TEACHER/PARENT: يرى الإشعارات العامة أو الخاصة به
    return notifications.filter(
      (n) => n.user_id === user_id || n.user_id === "ALL"
    );
  }, [role, user_id, notifications]);

  // 2. ترتيب الإشعارات تنازلياً حسب التاريخ
  const sortedNotifications = useMemo(() => {
    return [...filteredNotifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [filteredNotifications]);

  const unreadCount = sortedNotifications.filter(n => !n.is_read).length;

  // 3. دوال إدارة الحالة (Mark as Read / Delete)
  const handleMarkAsRead = useCallback((id: string) => {
    if (!isActionable) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    // TODO: استدعاء API للتحديث
  }, [isActionable]);

  const handleDelete = useCallback((id: string) => {
    if (role !== "ADMIN" && role !== "TEACHER") return; // يمكن الحذف من قبل ADMIN/TEACHER فقط
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: استدعاء API للحذف
  }, [role]);

  const handleMarkAllAsRead = useCallback(() => {
    if (!isActionable) return;
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
    // TODO: استدعاء API لتحديث الكل
  }, [isActionable]);

  // -----------------------------------------------------------------------------
  // 4. عرض الواجهة (UI)
  // -----------------------------------------------------------------------------

  return (
    <div className=" my-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-border/70">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
          <BellRing className="h-7 w-7 text-primary" />
          الإشعارات ({unreadCount} غير مقروء)
        </h1>
        {isActionable && unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="text-sm font-medium hover:bg-muted/50">
            <MailOpen className="h-4 w-4 ml-2" />
            تمييز الكل كمقروء
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] rounded-lg border shadow-xl bg-card">
        <div className="p-4 space-y-3">
          {sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
              <Mail className="h-12 w-12 mb-4 text-muted" />
              <p className="text-lg font-medium">لا توجد إشعارات حالياً.</p>
              <p className="text-sm">صندوق الوارد الخاص بك فارغ.</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                isActionable={isActionable} // PARENT دائماً تكون false
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationsPage;