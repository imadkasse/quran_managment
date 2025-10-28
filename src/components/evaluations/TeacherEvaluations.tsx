"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import showToast from "@/utils/showToast";
import { Evaluation, Student } from "@/types/types";
import { Database } from "@/types/supabase.types";
import {
  deleteEvaluation,
  insertEvaluation,
  updateEvaluation,
} from "@/services/teacher";

type FormData = Database["public"]["Tables"]["evaluations"]["Insert"];

// Mock data

interface Props {
  evaluationFetcher: Evaluation[] | null;
  studentsFetchers: Student[];
}
export default function TeacherEvaluations({
  evaluationFetcher,
  studentsFetchers,
}: Props) {
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // another time get this from session

  const [evaluations, setEvaluations] = useState<Evaluation[]>(
    evaluationFetcher || []
  );
  const [students, setStudents] = useState<Student[]>(studentsFetchers || []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<Evaluation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isCreatedLoading, setIsCreatedLoading] = useState(false);
  const [isEditeingLoading, setIsEditeingLoading] = useState(false);
  const [isDeleteingLoading, setIsDeleteingLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    student_id: "",
    teacher_id: "",
    subject: "",
    score: 0,
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student ? student.full_name : "غير معروف";
  };

  const resetForm = () => {
    setFormData({
      student_id: "",
      teacher_id: "",
      subject: "",
      score: 0,
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.student_id) newErrors.student_id = "الطالب مطلوب";
    if (!formData.subject.trim()) newErrors.subject = "المقدار مطلوب";
    // add valid the score

    if (!formData.date) newErrors.date = "التاريخ مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (
    mode: "create" | "edit" | "view",
    evaluation?: Evaluation
  ) => {
    setViewMode(mode);
    if (evaluation) {
      setSelectedEvaluation(evaluation);
      setFormData({
        student_id: evaluation.student_id,
        teacher_id: evaluation.teacher_id,
        subject: evaluation.subject,
        score: evaluation.score,
        date: new Date().toISOString().split("T")[0],
        note: evaluation.note || "",
      });
    } else {
      resetForm();
      setSelectedEvaluation(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
    setSelectedEvaluation(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (viewMode === "create") {
      try {
        setIsCreatedLoading(true);
        // sending the teacher_id is required
        formData.teacher_id = teacher_id;
        const newEvaluation = await insertEvaluation(formData);
        if (!newEvaluation) {
          showToast("error", "فشل إنشاء التقدم");
          return;
        }

        setEvaluations((prev) => [newEvaluation, ...prev]);
        showToast("success", "تم إنشاء تقدم بنجاح");
      } catch (error: any) {
        console.log(error);
        showToast("error", error.message || `Error when deleteing Evaluation`);
      } finally {
        setIsCreatedLoading(false);
      }
    }

    if (viewMode === "edit" && selectedEvaluation) {
      try {
        setIsEditeingLoading(true);
        const updatedEvaluation = await updateEvaluation(
          selectedEvaluation.id,
          teacher_id,
          formData
        );
        console.log("updated Evaluation : ", updatedEvaluation);
        if (!updatedEvaluation) {
          showToast("error", "فشل تعديل التقدم");
          return;
        }
        showToast("success", "تم تعديل التقدم بنجاح");
        setEvaluations((prev) =>
          prev.map((ev) =>
            ev.id === selectedEvaluation.id ? updatedEvaluation : ev
          )
        );
      } catch (error: any) {
        console.log(error);
        showToast("error", error.message);
      } finally {
        setIsEditeingLoading(false);
      }
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteingLoading(true);
    try {
      if (deleteId) {
        const isDeleted = await deleteEvaluation(deleteId, teacher_id);
        if (!isDeleted?.status) {
          showToast("error", "خطأ أثناء حذف التقدم");
          return;
        }
        setEvaluations((prev) => prev.filter((ev) => ev.id !== deleteId));
        showToast("success", "تم حذف التقدم بنجاح");
      }
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error");
    } finally {
      setIsDeleteingLoading(false);
    }

    setIsDeleteDialogOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-primary font-semibold";
    if (score >= 50) return "text-secondary font-semibold";
    return "text-destructive font-semibold";
  };

  return (
    <div className=" bg-background p-4 md:p-8">
      <div className="w-full  space-y-6">
        {/* Header */}
        <Card className="shadow-xl border-2">
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  التقييمات
                </h1>
              </div>
              <Button
                onClick={() => handleOpenDialog("create")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus className="h-4 w-4" />
                تقييم جديد
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي التقييمات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {evaluations.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                متوسط الدرجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {evaluations.length > 0
                  ? (
                      evaluations.reduce((sum, ev) => sum + ev.score, 0) /
                      evaluations.length
                    ).toFixed(2)
                  : "0.00"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                أعلى درجة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {evaluations.length > 0
                  ? Math.max(...evaluations.map((ev) => ev.score))
                  : "0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                          الطالب
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                          المادة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                          الدرجة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider">
                          التاريخ
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {evaluations.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-8 text-center text-muted-foreground"
                          >
                            لا توجد تقييمات بعد
                          </td>
                        </tr>
                      ) : (
                        evaluations.map((evaluation) => (
                          <tr
                            key={evaluation.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                              {getStudentName(evaluation.student_id)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                              {evaluation.subject}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm ${getScoreColor(
                                evaluation.score
                              )}`}
                            >
                              {evaluation.score}/100
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {new Date(evaluation.date).toLocaleDateString(
                                "ar-DZ"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenDialog("view", evaluation)
                                  }
                                  className="h-8 w-8 p-0 hover:bg-accent"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenDialog("edit", evaluation)
                                  }
                                  className="h-8 w-8 p-0 hover:bg-accent"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteClick(evaluation.id)
                                  }
                                  className={`h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 `}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Create/Edit/View */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {viewMode === "create" && "تقييم جديد"}
              {viewMode === "edit" && "تعديل التقييم"}
              {viewMode === "view" && "عرض التقييم"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">الطالب *</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, student_id: value })
                }
                disabled={viewMode === "view"}
              >
                <SelectTrigger
                  className={errors.student_id ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.student_id && (
                <p className="text-sm text-destructive">{errors.student_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">المادة *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="مثال: الرياضيات"
                disabled={viewMode === "view"}
                className={errors.subject ? "border-destructive" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">الدرجة (من 20) *</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: Number(e.target.value) })
                }
                placeholder="مثال: 15"
                disabled={viewMode === "view"}
                className={errors.score ? "border-destructive" : ""}
              />
              {errors.score && (
                <p className="text-sm text-destructive">{errors.score}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">التاريخ *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  disabled={viewMode === "view"}
                  className={errors.date ? "border-destructive" : ""}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">ملاحظات (اختياري)</Label>
              <Textarea
                id="note"
                value={formData.note as undefined}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="أضف ملاحظات إضافية..."
                disabled={viewMode === "view"}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              {viewMode === "view" ? "إغلاق" : "إلغاء"}
            </Button>
            {viewMode !== "view" && (
              <Button
                type="button"
                onClick={handleSubmit}
                className={`bg-primary hover:bg-primary/90 ${
                  isCreatedLoading ? "bg-primary/90 cursor-not-allowed" : ""
                }`}
                disabled={isCreatedLoading}
              >
                {viewMode === "create" ? (
                  <>
                    {isCreatedLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "إضافة"
                    )}
                  </>
                ) : (
                  <>
                    {isEditeingLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "حفظ"
                    )}
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف هذا التقييم؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className={`bg-destructive hover:bg-destructive/90 ${
                isDeleteingLoading ? "bg-destructive/90 cursor-not-allowed" : ""
              }`}
              disabled={isDeleteingLoading}
            >
              {isDeleteingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                "حذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
