"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  GraduationCap,
  Users,
  Edit,
  Trash,
} from "lucide-react";
import { Student } from "@/types/types";

interface StudentCardProps {
  student: Student | null;
  open: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  open,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };
  const handleEdit = () => {
    onEdit();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0  gap-0 bg-card border-border">
        <Card className="border-0 shadow-none">
          {/* Header */}
          <CardHeader className="space-y-4 pt-4 border-b border-border bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center ring-4 ring-primary/5">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground mb-1">
                    {student?.full_name}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-muted rounded-md font-mono">
                      ID: {student?.id}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-6 p-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                المعلومات الأساسية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border hover:border-accent/30 transition-colors">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      العمر
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {student?.age} سنة
                    </p>
                  </div>
                </div>

                {/* Level */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border hover:border-secondary/30 transition-colors">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">
                      المستوى الدراسي
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {student?.level}
                    </p>
                  </div>
                </div>

                {/* Parent Info */}
                {student?.parent_id && student?.parent && (
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-colors sm:col-span-2">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">
                        ولي الأمر
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {student.parent.username}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Summary - Placeholder */}
            {/* <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-accent rounded-full"></div>
                ملخص الحضور
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      --
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    أيام الحضور
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-2xl font-bold text-foreground">
                      --
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    أيام الغياب
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 text-secondary-foreground" />
                    <span className="text-2xl font-bold text-foreground">
                      --%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    نسبة الحضور
                  </p>
                </div>
              </div>
            </div> */}

            {/* Subscriptions & Evaluations - Placeholder */}
            {/* <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-secondary rounded-full"></div>
                الاشتراكات والتقييمات
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-muted/20 rounded-xl border border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        الاشتراكات النشطة
                      </p>
                      <p className="text-sm text-muted-foreground">
                        لا توجد بيانات متاحة حالياً
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted/20 rounded-xl border border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        التقييمات الأخيرة
                      </p>
                      <p className="text-sm text-muted-foreground">
                        لا توجد بيانات متاحة حالياً
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </CardContent>

          {/* Footer Actions */}
          <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border bg-muted/10">
            {!showDeleteConfirm ? (
              <>
                <Button
                  onClick={onEdit}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                >
                  <Edit className="w-4 h-4" />
                  تعديل البيانات
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <Trash className="w-4 h-4" />
                  حذف الطالب
                </Button>
              </>
            ) : (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <Trash className="w-5 h-5 text-destructive" />
                  <p className="text-sm font-medium text-destructive">
                    هل أنت متأكد من حذف هذا الطالب؟
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="flex-1"
                  >
                    تأكيد الحذف
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
