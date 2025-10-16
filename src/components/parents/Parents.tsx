"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Mail,
  Calendar,
  Eye,
  Edit,
  Trash,
  Plus,
  Search,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { AddParentFormData, Parent } from "@/types/types";
import AddParentModal from "./AddParentModal";
import axios from "axios";
import showToast from "@/utils/showToast";

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("ar-DZ", options);
  const formattedTime = date.toLocaleTimeString("ar-DZ", timeOptions);
  return `${formattedDate} • ${formattedTime}`;
};

// Parent Actions Component
interface ParentActionsProps {
  parent: Parent;
  onEdit: (parent: Parent) => void;
  onDelete: (parent: Parent) => void;
  isDeleteing: boolean;
}

const ParentActions: React.FC<ParentActionsProps> = ({
  parent,
  onEdit,
  onDelete,
  isDeleteing,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* no need to edit a parent */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onEdit(parent)}
        className="hover:bg-accent/10 hover:text-accent"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDelete(parent)}
        className={`hover:bg-destructive/10 hover:text-destructive ${
          isDeleteing ? "cursor-not-allowed " : ""
        }`}
      >
        {isDeleteing ? (
          <Loader2 className="h4 w-4 animate-spin " />
        ) : (
          <Trash className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

// Mobile Parent Card
interface ParentCardProps {
  parent: Parent;
  onView: (parent: Parent) => void;
  onEdit: (parent: Parent) => void;
  onDelete: (parent: Parent) => void;
  isDeleteing: boolean;
}

const ParentCard: React.FC<ParentCardProps> = ({
  parent,
  onEdit,
  onDelete,
  isDeleteing,
}) => {
  return (
    <Card className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  {parent?.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  معرف: {parent?.id}
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <p className="text-sm text-muted-foreground">{parent?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary-foreground" />
              <p className="text-sm text-muted-foreground">
                {parent?.created_at
                  ? formatDate(parent?.created_at)
                  : formatDate(String(Date.now()))}
              </p>
            </div>
            {/* {parent.students_count !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {parent.students_count}{" "}
                  {parent.students_count === 1 ? "طالب" : "طلاب"}
                </p>
              </div>
            )} */}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            {/* no need to edit parent */}
            <Button
              size="sm"
              onClick={() => onEdit(parent)}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </Button>
            <Button
              size="sm"
              onClick={() => onDelete(parent)}
              variant="outline"
              className={`hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30  ${
                isDeleteing ? "cursor-not-allowed " : ""
              }`}
            >
              {isDeleteing ? (
                <Loader2 className="h4 w-4 animate-spin " />
              ) : (
                <Trash className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Desktop Table Component
interface ParentTableProps {
  parents: Parent[];
  onView: (parent: Parent) => void;
  onEdit: (parent: Parent) => void;
  onDelete: (parent: Parent) => void;
  isDeteleting: boolean;
}

const ParentTable: React.FC<ParentTableProps> = ({
  parents,
  onEdit,
  onDelete,
  isDeteleting,
}) => {
  return (
    <div className="rounded-2xl border border-border  bg-card shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-right px-6 py-4 text-foreground font-semibold">
                اسم المستخدم
              </th>
              <th className="text-right px-6 py-4 text-foreground font-semibold">
                البريد الإلكتروني
              </th>
              <th className="text-right px-6 py-4 text-foreground font-semibold">
                عدد الطلاب
              </th>
              <th className="text-right px-6 py-4 text-foreground font-semibold">
                تاريخ التسجيل
              </th>
              <th className="text-center px-6 py-4 text-foreground font-semibold">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent, index) => (
              <tr
                key={parent?.id}
                className={`hover:bg-accent/5 transition-colors border-b border-border ${
                  index === parents.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {parent?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {parent?.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    <span className="text-foreground">{parent?.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-foreground">
                      {/* {parent.students_count || 0} */}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {parent?.created_at
                        ? formatDate(parent?.created_at)
                        : formatDate(String(Date.now()))}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <ParentActions
                      parent={parent}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDeleteing={isDeteleting}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Parents Page Component
export default function ParentsPage({
  parentsFromDb,
}: {
  parentsFromDb: Parent[];
}) {
  const [parents, setParents] = useState<Parent[]>(parentsFromDb);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parentToDelete, setParentToDelete] = useState<Parent | null>(null);
  const itemsPerPage = 5;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isDeleteing, setIsDeleteing] = useState(false);
  const teacher_id = "bcc9c2c1-524b-432b-b0e0-3f74d6b9c11f";

  // Filter parents based on search
  const filteredParents = useMemo(() => {
    return parents.filter(
      (parent) =>
        parent?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [parents, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParents = filteredParents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleView = (parent: Parent) => {
    alert(`عرض تفاصيل: ${parent?.username}`);
  };

  const handleEdit = (parent: Parent) => {
    alert(`تعديل: ${parent?.username}`);
  };

  const handleDeleteClick = (parent: Parent) => {
    setParentToDelete(parent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteing(true);
    try {
      await axios.delete(
        `/api/teachers/delete-parent?teacher_id=${teacher_id}&parentId=${parentToDelete?.id}`
      );
      setParents(parents.filter((p) => p?.id !== parentToDelete?.id));
      setDeleteDialogOpen(false);
      setParentToDelete(null);
      showToast("success", `تم حذف الولي ${parentToDelete?.username} بنجاح`);
    } catch (err: any) {
      console.log("erro ", err);
      showToast("error", err.message || "حدث خطأ أثناء إضافة الولي");
    } finally {
      setIsDeleteing(false);
    }
  };

  const handleAddParentSubmit = async (data: AddParentFormData) => {
    try {
      const res = await axios.post("/api/teachers/add-parent", data);
      // add the parent to parents state
      setParents([...parents, res.data.parent]);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  };

  const handleAddNew = () => {
    setAddDialogOpen(true);
  };

  return (
    <div className=" ">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-3xl">
                    الأولياء
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    إدارة حسابات أولياء الأمور والطلاب
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAddNew}
                className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground gap-2 self-start md:self-auto"
              >
                <Plus className="w-5 h-5" />
                إضافة ولي جديد
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Toolbar */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pr-10 border-border focus:ring-primary"
                />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    فرز
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>الأحدث أولاً</DropdownMenuItem>
                  <DropdownMenuItem>الأقدم أولاً</DropdownMenuItem>
                  <DropdownMenuItem>حسب الاسم (أ-ي)</DropdownMenuItem>
                  <DropdownMenuItem>حسب الاسم (ي-أ)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    إجمالي الأولياء
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {parents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Search className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نتائج البحث</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredParents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <User className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلاب</p>
                  <p className="text-2xl font-bold text-foreground">
                    {/* {parents.reduce(
                      (sum, p) => sum + (p.students_count || 0),
                      0
                    )} */}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        {filteredParents.length === 0 ? (
          <Card className="border-border shadow-sm">
            <CardContent className="py-16">
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="p-6 bg-muted/30 rounded-full">
                  <Users className="w-16 h-16 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    لا توجد نتائج
                  </h3>
                  <p className="text-sm">
                    {searchQuery
                      ? "لم يتم العثور على أولياء أمور يطابقون البحث"
                      : "لا يوجد أولياء أمور مسجلين بعد"}
                  </p>
                </div>
                {!searchQuery && (
                  <Button
                    onClick={handleAddNew}
                    className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة أول ولي أمر
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <ParentTable
                parents={paginatedParents}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                isDeteleting={isDeleteing}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {paginatedParents.map((parent) => (
                <ParentCard
                  key={parent?.id}
                  parent={parent}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  isDeleteing={isDeleteing}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      عرض {startIndex + 1} -{" "}
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredParents.length
                      )}{" "}
                      من {filteredParents.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-6 h-6" />
                تأكيد الحذف
              </DialogTitle>
              <DialogDescription className="text-foreground">
                هل أنت متأكد من حذف ولي الأمر{" "}
                <span className="font-semibold">
                  {parentToDelete?.username}
                </span>
                ؟ سيتم حذف جميع البيانات المرتبطة به. هذا الإجراء لا يمكن
                التراجع عنه.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 " dir="ltr">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className={`${
                  isDeleteing ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isDeleteing ? (
                  <Loader2 className="h4 w-4 animate-spin " />
                ) : (
                  <>
                    <Trash className="w-4 h-4 mr-2" />
                    تأكيد الحذف
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AddParentModal
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAddParent={handleAddParentSubmit}
        />
      </div>
    </div>
  );
}
