"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  User,
  Calendar,
  GraduationCap,
  Users,
  UserPlus,
  Loader2,
  Plus,
  BookOpen,
  BookMarked,
  Edit3,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Parent, Student } from "@/types/types";
import { useUser } from "@/store/userStore";
import { StudentCard } from "../students/StudentCard";
import showToast from "@/utils/showToast";
import {
  deleteStudent,
  insertStudent,
  StudentWithParent,
  updateStudent,
} from "@/services/teacher";
import { Database } from "@/types/supabase.types";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type FormData = Database["public"]["Tables"]["students"]["Insert"];
type FormDataUpdate = Database["public"]["Tables"]["students"]["Update"];

interface Props {
  studentsFetcher: StudentWithParent[];
  parentsFetcher: Parent[];
}
const hizbLevels = [
  "حزب 1",
  "حزب 2",
  "حزب 3",
  "حزب 4",
  "حزب 5",
  "حزب 6",
  "حزب 7",
  "حزب 8",
  "حزب 9",
  "حزب 10",
  "حزب 11",
  "حزب 12",
  "حزب 13",
  "حزب 14",
  "حزب 15",
  "حزب 16",
  "حزب 17",
  "حزب 18",
  "حزب 19",
  "حزب 20",
  "حزب 21",
  "حزب 22",
  "حزب 23",
  "حزب 24",
  "حزب 25",
  "حزب 26",
  "حزب 27",
  "حزب 28",
  "حزب 29",
  "حزب 30",
  "حزب 31",
  "حزب 32",
  "حزب 33",
  "حزب 34",
  "حزب 35",
  "حزب 36",
  "حزب 37",
  "حزب 38",
  "حزب 39",
  "حزب 40",
  "حزب 41",
  "حزب 42",
  "حزب 43",
  "حزب 44",
  "حزب 45",
  "حزب 46",
  "حزب 47",
  "حزب 48",
  "حزب 49",
  "حزب 50",
  "حزب 51",
  "حزب 52",
  "حزب 53",
  "حزب 54",
  "حزب 55",
  "حزب 56",
  "حزب 57",
  "حزب 58",
  "حزب 59",
  "حزب 60",
];
const surahLevels = [
  "سورة الفاتحة",
  "سورة البقرة",
  "سورة آل عمران",
  "سورة النساء",
  "سورة المائدة",
  "سورة الأنعام",
  "سورة الأعراف",
  "سورة الأنفال",
  "سورة التوبة",
  "سورة يونس",
  "سورة هود",
  "سورة يوسف",
  "سورة الرعد",
  "سورة إبراهيم",
  "سورة الحجر",
  "سورة النحل",
  "سورة الإسراء",
  "سورة الكهف",
  "سورة مريم",
  "سورة طه",
  "سورة الأنبياء",
  "سورة الحج",
  "سورة المؤمنون",
  "سورة النور",
  "سورة الفرقان",
  "سورة الشعراء",
  "سورة النمل",
  "سورة القصص",
  "سورة العنكبوت",
  "سورة الروم",
  "سورة لقمان",
  "سورة السجدة",
  "سورة الأحزاب",
  "سورة سبأ",
  "سورة فاطر",
  "سورة يس",
  "سورة الصافات",
  "سورة ص",
  "سورة الزمر",
  "سورة غافر",
  "سورة فصلت",
  "سورة الشورى",
  "سورة الزخرف",
  "سورة الدخان",
  "سورة الجاثية",
  "سورة الأحقاف",
  "سورة محمد",
  "سورة الفتح",
  "سورة الحجرات",
  "سورة ق",
  "سورة الذاريات",
  "سورة الطور",
  "سورة النجم",
  "سورة القمر",
  "سورة الرحمن",
  "سورة الواقعة",
  "سورة الحديد",
  "سورة المجادلة",
  "سورة الحشر",
  "سورة الممتحنة",
  "سورة الصف",
  "سورة الجمعة",
  "سورة المنافقون",
  "سورة التغابن",
  "سورة الطلاق",
  "سورة التحريم",
  "سورة الملك",
  "سورة القلم",
  "سورة الحاقة",
  "سورة المعارج",
  "سورة نوح",
  "سورة الجن",
  "سورة المزمل",
  "سورة المدثر",
  "سورة القيامة",
  "سورة الإنسان",
  "سورة المرسلات",
  "سورة النبأ",
  "سورة النازعات",
  "سورة عبس",
  "سورة التكوير",
  "سورة الانفطار",
  "سورة المطففين",
  "سورة الانشقاق",
  "سورة البروج",
  "سورة الطارق",
  "سورة الأعلى",
  "سورة الغاشية",
  "سورة الفجر",
  "سورة البلد",
  "سورة الشمس",
  "سورة الليل",
  "سورة الضحى",
  "سورة الشرح",
  "سورة التين",
  "سورة العلق",
  "سورة القدر",
  "سورة البينة",
  "سورة الزلزلة",
  "سورة العاديات",
  "سورة القارعة",
  "سورة التكاثر",
  "سورة العصر",
  "سورة الهمزة",
  "سورة الفيل",
  "سورة قريش",
  "سورة الماعون",
  "سورة الكوثر",
  "سورة الكافرون",
  "سورة النصر",
  "سورة المسد",
  "سورة الإخلاص",
  "سورة الفلق",
  "سورة الناس",
];

export const StudentsTable = ({ studentsFetcher, parentsFetcher }: Props) => {
  const { user } = useUser();
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f"; // another time get this from session

  const [students, setStudents] =
    useState<StudentWithParent[]>(studentsFetcher);
  const parents = parentsFetcher;
  const [levelType, setLevelType] = useState<"hizb" | "surah" | "manual">(
    "hizb"
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const options = [
    {
      value: "hizb",
      label: "أحزاب",
      icon: BookOpen,
      description: "تقسيم القرآن إلى أحزاب",
      color: "primary",
    },
    {
      value: "surah",
      label: "سور",
      icon: BookMarked,
      description: "تقسيم القرآن إلى سور",
      color: "accent",
    },
    {
      value: "manual",
      label: "يدوي",
      icon: Edit3,
      description: "إدخال مخصص",
      color: "secondary",
    },
  ] as const;

  // using in Modal (studentCard)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    age: 0,
    level: "",
    parent_id: "",
    teacher_id: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [formDataUpdate, setFormDataUpdate] = useState<FormDataUpdate>({
    full_name: "",
    age: 0,
    level: "",
    parent_id: "",
    teacher_id: "",
  });
  const [formUpdateErrors, setFormUpdateErrors] = useState<
    Partial<FormDataUpdate>
  >({});

  const [isEditeingLoading, setIsEditeingLoading] = useState(false);
  const [isDeleteingLoading, setIsDeleteingLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const handleInputChangeOnEdit = (field: keyof FormData, value: string) => {
    setFormDataUpdate((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormUpdateErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "الاسم الكامل مطلوب";
    }
    if (!formData.age || formData.age < 1 || formData.age > 100) {
      // errors.age = "العمر يجب أن يكون بين 1 و 100";
    }
    if (!formData.level) {
      errors.level = "المستوى الدراسي مطلوب";
    }
    if (!formData.parent_id) {
      errors.parent_id = "ولي الأمر مطلوب";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateFormOnUpdate = (): boolean => {
    const errors: Partial<FormDataUpdate> = {};

    if (!formDataUpdate.full_name?.trim()) {
      errors.full_name = "الاسم الكامل مطلوب";
    }
    if (
      !formDataUpdate.age ||
      formDataUpdate.age < 1 ||
      formDataUpdate.age > 100
    ) {
      // errors.age = "العمر يجب أن يكون بين 1 و 100";
    }
    if (!formDataUpdate.level) {
      errors.level = "المستوى الدراسي مطلوب";
    }
    if (!formDataUpdate.parent_id) {
      errors.parent_id = "ولي الأمر مطلوب";
    }

    setFormUpdateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      formData.teacher_id = teacher_id; // update this in after time
      console.log("form data :", formData);
      const newStudent = await insertStudent(formData);
      if (!newStudent) {
        showToast("error", "فشل أثناء إضافة طالب");
        return;
      }
      showToast("success", "تم إضافة الطالب بنجاح");
      // Prepend new student to the list
      setStudents((prev) => [...prev, newStudent]);

      // Reset form and close modal
      setFormData({
        full_name: "",
        age: 0,
        level: "",
        parent_id: "",
        teacher_id: "",
      });
      setFormErrors({});
      setShowAddModal(false);
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Opps An Error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      full_name: "",
      age: 0,
      level: "",
      parent_id: "",
      teacher_id: "",
    });
    setFormErrors({});
  };
  const handleOpenDialog = (student: Student) => {
    setIsDialogOpen(true);
    setSelectedStudent(student);
    setFormDataUpdate({
      id: student.id,
      full_name: student.full_name,
      age: student.age,
      level: student.level,
      teacher_id: student.teacher_id,
      parent_id: student.parent_id,
    });
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // resetForm();
    setSelectedStudent(null);
  };

  const handleEdit = async () => {
    setIsEditeingLoading(true);
    if (!validateFormOnUpdate()) {
      return;
    }
    try {
      const updatedStudent = await updateStudent(
        formDataUpdate.id as string,
        formDataUpdate as Student
      );
      if (!updatedStudent) {
        showToast("error", "فشل أثناء تحديث بيانات الطالب");
        return;
      }
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error");
    } finally {
      setIsEditeingLoading(false);
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
        const isDeleted = await deleteStudent(deleteId);
        if (!isDeleted) {
          showToast("error", "خطأ أثناء حذف الطالب");
          return;
        }
        setStudents((prev) => prev.filter((s) => s.id !== deleteId));
        showToast("success", "تم حذف الطالب بنجاح");
      }
    } catch (error: any) {
      console.log(error);
      showToast("error", error.message || "Oops An Error");
    } finally {
      setIsDeleteingLoading(false);
    }

    setIsDeleteDialogOpen(false);
  };
  // Mobile Card View Component
  const MobileStudentCard: React.FC<{ student: Student }> = ({ student }) => (
    <>
      <Card className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header with Name */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {student.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    معرف: {student.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">العمر</p>
                  <p className="font-medium text-foreground">
                    {student.age} سنة
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <GraduationCap className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">المستوى</p>
                  <p className="font-medium text-foreground">{student.level}</p>
                </div>
              </div>
            </div>

            {/* Parent Name (Teacher Only) */}
            {user?.role === "TEACHER" && student.parent_id && (
              <div className="flex items-center gap-2 pt-2">
                <div className="p-2 bg-muted rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ولي الأمر</p>
                  <p className="font-medium text-foreground">
                    {student.parent?.username}
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="border-t border-border py-2">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(student)}
                  className="h-8 w-8 p-0 hover:bg-accent cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog(student)}
                  className="h-8 w-8 p-0 hover:bg-accent cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(student?.id)}
                  className={`h-8 w-8 p-0 text-destructive cursor-pointer hover:text-destructive hover:bg-destructive/10 `}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <StudentCard
        student={selectedStudent}
        open={!!selectedStudent && isDialogOpen === false}
        onEdit={() => alert(`تعديل الطالب${selectedStudent?.full_name}`)}
        onDelete={() => alert(`تعديل الطالب${selectedStudent?.full_name}`)}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );

  // Desktop Table View
  const DesktopTable = () => (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                الاسم الكامل
              </th>
              <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                العمر
              </th>
              <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                المستوى
              </th>
              {user?.role === "TEACHER" && (
                <th className="text-right px-4 py-3 text-foreground font-semibold border-b border-border">
                  ولي الأمر
                </th>
              )}
              <th className="text-center px-4 py-3 text-foreground font-semibold border-b border-border">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={user?.role === "TEACHER" ? 5 : 4}
                  className="text-center py-8 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-12 h-12 text-muted-foreground/50" />
                    <p>لا توجد بيانات طلاب</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-accent/5 transition-colors border-b border-border"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {student.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>{student.age} سنة</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-sm font-medium">
                      <GraduationCap className="w-4 h-4" />
                      {student.level}
                    </span>
                  </td>
                  {user?.role === "TEACHER" && (
                    <td className="px-4 py-4 text-foreground">
                      {student.parent_id ? (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{student.parent?.username}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          غير متوفر
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                        className="h-8 w-8 p-0 hover:bg-accent cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user?.role === "TEACHER" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleOpenDialog(student);
                            }}
                            className="h-8 w-8 p-0 hover:bg-accent cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(student?.id)}
                            className={`h-8 w-8 p-0 text-destructive cursor-pointer hover:text-destructive hover:bg-destructive/10 `}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground text-2xl">
                  {user?.role === "TEACHER" ? "قائمة الطلاب" : "أبنائي"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  إجمالي: {students.length}{" "}
                  {students.length === 1 ? "طالب" : "طلاب"}
                </p>
              </div>
            </div>
            {user?.role === "TEACHER" && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6 py-6 cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <UserPlus className="w-5 h-5" />
                إضافة طالب
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Desktop View - Hidden on Mobile */}
      <div className="hidden md:block">
        <DesktopTable />
      </div>

      {/* Mobile View - Cards Grid */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {students.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Users className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-center font-medium">لا توجد بيانات طلاب</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          students.map((student) => (
            <MobileStudentCard key={student.id} student={student} />
          ))
        )}
      </div>
      {/* ========== Add Student Dialog ========== */}
      <Dialog open={showAddModal} onOpenChange={handleCloseAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <div
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.3 }}
          >
            <DialogHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    إضافة طالب جديد
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    أدخل بيانات الطالب الجديد بشكل كامل
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* ========== Form Fields ========== */}
            <form onSubmit={handleSubmit} className="space-y-6 pt-6">
              <AnimatePresence mode="wait">
                {/* Full Name Field */}
                <div
                  // initial={{ opacity: 0, x: -20 }}
                  // animate={{ opacity: 1, x: 0 }}
                  // transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="full_name"
                    className="text-foreground font-semibold flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-primary" />
                    الاسم الكامل
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    placeholder="أدخل الاسم الكامل للطالب"
                    className={`${
                      formErrors.full_name ? "border-destructive" : ""
                    } bg-background border-border text-foreground placeholder:text-muted-foreground`}
                    disabled={isSubmitting}
                  />
                  {formErrors.full_name && (
                    <p className="text-sm text-destructive">
                      {formErrors.full_name}
                    </p>
                  )}
                </div>

                {/* Age Field */}
                <div
                  // initial={{ opacity: 0, x: -20 }}
                  // animate={{ opacity: 1, x: 0 }}
                  // transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="age"
                    className="text-foreground font-semibold flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-accent" />
                    العمر
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="أدخل عمر الطالب"
                    min="1"
                    max="100"
                    className={`${
                      formErrors.age ? "border-destructive" : ""
                    } bg-background border-border text-foreground placeholder:text-muted-foreground`}
                    disabled={isSubmitting}
                  />
                  {formErrors.age && (
                    <p className="text-sm text-destructive">{formErrors.age}</p>
                  )}
                </div>
                {/* اختيار نوع المستوى */}

                <div className="space-y-4">
                  <Label className="text-foreground font-semibold flex items-center gap-2 text-lg">
                    نوع المستوى
                    <span className="text-destructive">*</span>
                  </Label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {options.map((option) => {
                      const Icon = option.icon;
                      const isSelected = levelType === option.value;

                      return (
                        <label
                          key={option.value}
                          // whileHover={{ scale: 1.02 }}
                          // whileTap={{ scale: 0.98 }}
                          className="relative cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="levelType"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => setLevelType(option.value as any)}
                            className="sr-only peer"
                          />

                          <div
                            className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300
                    ${
                      isSelected
                        ? option.color === "primary"
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                          : option.color === "accent"
                          ? "border-accent bg-accent/5 shadow-lg shadow-accent/20"
                          : "border-secondary bg-secondary/5 shadow-lg shadow-secondary/20"
                        : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/20"
                    }
                  `}
                          >
                            {/* Selection Indicator */}
                            <div
                              className={`
                      absolute top-3 left-3 w-5 h-5 rounded-full border-2 transition-all
                      ${
                        isSelected
                          ? option.color === "primary"
                            ? "border-primary bg-primary"
                            : option.color === "accent"
                            ? "border-accent bg-accent"
                            : "border-secondary bg-secondary"
                          : "border-muted bg-background"
                      }
                    `}
                            >
                              {isSelected && (
                                <div
                                  // initial={{ scale: 0 }}
                                  // animate={{ scale: 1 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              )}
                            </div>

                            {/* Icon */}
                            <div
                              className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all
                      ${
                        isSelected
                          ? option.color === "primary"
                            ? "bg-primary/15"
                            : option.color === "accent"
                            ? "bg-accent/15"
                            : "bg-secondary/15"
                          : "bg-muted/30"
                      }
                    `}
                            >
                              <Icon
                                className={`
                        w-7 h-7 transition-colors
                        ${
                          isSelected
                            ? option.color === "primary"
                              ? "text-primary"
                              : option.color === "accent"
                              ? "text-accent"
                              : "text-secondary-foreground"
                            : "text-muted-foreground"
                        }
                      `}
                              />
                            </div>

                            {/* Label */}
                            <h3
                              className={`
                      text-xl font-bold mb-2 transition-colors
                      ${isSelected ? "text-foreground" : "text-foreground/80"}
                    `}
                            >
                              {option.label}
                            </h3>

                            {/* Glow Effect */}
                            {isSelected && (
                              <div
                                // initial={{ opacity: 0 }}
                                // animate={{ opacity: 1 }}
                                className={`
                        absolute inset-0 rounded-xl -z-10 blur-xl
                        ${
                          option.color === "primary"
                            ? "bg-primary/10"
                            : option.color === "accent"
                            ? "bg-accent/10"
                            : "bg-secondary/10"
                        }
                      `}
                              />
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Level Field */}
                {levelType === "manual" ? (
                  <Input
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    placeholder="أدخل المستوى يدوياً"
                    disabled={isSubmitting}
                  />
                ) : (
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleInputChange("level", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {(levelType === "hizb" ? hizbLevels : surahLevels).map(
                        (level) => (
                          <SelectItem key={Math.random() * 100} value={level}>
                            {level}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}

                {/* Parent Field */}
                <div
                  // initial={{ opacity: 0, x: -20 }}
                  // animate={{ opacity: 1, x: 0 }}
                  // transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="parent_id"
                    className="text-foreground font-semibold flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-primary" />
                    ولي الأمر
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) =>
                      handleInputChange("parent_id", value)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      className={`${
                        formErrors.parent_id ? "border-destructive" : ""
                      } bg-background border-border text-foreground`}
                    >
                      <SelectValue placeholder="اختر ولي الأمر" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {parents.map((parent) => (
                        <SelectItem
                          key={parent?.id}
                          value={parent?.id as string}
                          className="text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          {parent?.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.parent_id && (
                    <p className="text-sm text-destructive">
                      {formErrors.parent_id}
                    </p>
                  )}
                </div>
              </AnimatePresence>

              {/* ========== Form Actions ========== */}
              <div
                // initial={{ opacity: 0, y: 20 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ delay: 0.5 }}
                className="flex gap-3 pt-4 border-t border-border"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      إضافة الطالب
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseAddModal}
                  disabled={isSubmitting}
                  className="flex-1 border-border text-foreground hover:bg-muted py-6"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog for Edit*/}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل طالب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* full name */}
            <div className="space-y-2">
              <Label
                htmlFor="full_name"
                className="text-foreground font-semibold flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary" />
                الاسم الكامل
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                value={formDataUpdate?.full_name}
                onChange={(e) =>
                  handleInputChangeOnEdit("full_name", e.target.value)
                }
                placeholder="أدخل الاسم الكامل للطالب"
                className={`${
                  formUpdateErrors.full_name ? "border-destructive" : ""
                } bg-background border-border text-foreground placeholder:text-muted-foreground`}
                disabled={isEditeingLoading}
              />
              {formUpdateErrors.full_name && (
                <p className="text-sm text-destructive">
                  {formUpdateErrors.full_name}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label
                htmlFor="age"
                className="text-foreground font-semibold flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-accent" />
                العمر
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                value={formDataUpdate?.age}
                onChange={(e) => handleInputChangeOnEdit("age", e.target.value)}
                placeholder="أدخل عمر الطالب"
                min="1"
                max="100"
                className={`${
                  formUpdateErrors.age ? "border-destructive" : ""
                } bg-background border-border text-foreground placeholder:text-muted-foreground`}
                disabled={isEditeingLoading}
              />
              {formUpdateErrors.age && (
                <p className="text-sm text-destructive">
                  {formUpdateErrors.age}
                </p>
              )}
            </div>

            {/* Level Field */}

            <Input
              value={formDataUpdate?.level}
              onChange={(e) => handleInputChangeOnEdit("level", e.target.value)}
              placeholder="أدخل المستوى يدوياً"
              disabled={isEditeingLoading}
            />

            {/* Parent Field */}
            <div
              // initial={{ opacity: 0, x: -20 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label
                htmlFor="parent_id"
                className="text-foreground font-semibold flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-primary" />
                ولي الأمر
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formDataUpdate?.parent_id}
                onValueChange={(value) =>
                  handleInputChangeOnEdit("parent_id", value)
                }
                disabled={isEditeingLoading}
              >
                <SelectTrigger
                  className={`${
                    formErrors.parent_id ? "border-destructive" : ""
                  } bg-background border-border text-foreground`}
                >
                  <SelectValue placeholder="اختر ولي الأمر" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {parents.map((parent) => (
                    <SelectItem
                      key={parent?.id}
                      value={parent?.id as string}
                      className="text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {parent?.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formUpdateErrors.parent_id && (
                <p className="text-sm text-destructive">
                  {formUpdateErrors.parent_id}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              إلغاء
            </Button>

            <Button
              type="button"
              onClick={handleEdit}
              className={`bg-primary hover:bg-primary/90 ${
                isEditeingLoading ? "bg-primary/90 cursor-not-allowed" : ""
              }`}
              disabled={isEditeingLoading}
            >
              <>
                {isEditeingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "حفظ"
                )}
              </>
            </Button>
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
      {/* Footer Info */}
      {students.length > 0 && (
        <Card className="border-border bg-muted/30">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-muted-foreground font-medium">
                  عرض {students.length} من {students.length} طالب
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">نشط</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-accent" />
                  <span className="text-muted-foreground">
                    آخر تحديث: {new Date().toLocaleDateString("ar-DZ")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
