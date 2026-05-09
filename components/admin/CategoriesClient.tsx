"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { Plus, Pencil, Trash2, Tag, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  });

  const openAdd = () => { setEditing(null); reset({}); setIsFormOpen(true); };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    reset({ name: cat.name, nameAr: cat.nameAr || "", description: cat.description || "", image: cat.image || "" });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: CategoryInput) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, slug: data.slug || slugify(data.name) };
      const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const saved = await res.json();
        if (!res.ok) throw new Error(saved.error || "فشل الحفظ");

        if (editing) {
          setCategories(prev => prev.map(c => c.id === saved.id ? { ...saved, _count: c._count } : c));
          toast.success("تم تعديل الفئة بنجاح");
        } else {
          setCategories(prev => [{ ...saved, _count: { products: 0 } }, ...prev]);
          toast.success("تم إضافة الفئة بنجاح");
        }
        setIsFormOpen(false);
      } else {
        throw new Error(`Server error (${res.status})`);
      }
    } catch (err) { 
      console.error("Category save error:", err);
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/categories/${deletingId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "فشل الحذف");
      }
      setCategories(prev => prev.filter(c => c.id !== deletingId));
      toast.success("تم حذف الفئة بنجاح");
    } catch (err) { 
      toast.error(err instanceof Error ? err.message : "حدث خطأ أثناء الحذف"); 
    } finally { 
      setDeletingId(null); 
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الفئات</h1>
          <p className="text-muted-foreground text-sm">{categories.length} فئة</p>
        </div>
        <Button onClick={openAdd} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white gap-2">
          <Plus className="w-4 h-4" /> إضافة فئة
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto opacity-30 mb-3" />
            <p>لا توجد فئات. اضغط "إضافة فئة" للبدء.</p>
          </div>
        ) : (
          categories.map(cat => (
            <Card key={cat.id} className="border-0 shadow-sm overflow-hidden group">
              {cat.image && (
                <div className="relative h-36 overflow-hidden bg-muted">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="400px" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{cat.nameAr || cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{cat._count.products} منتج</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => setDeletingId(cat.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم (EN) *</Label>
                <Input {...register("name")} placeholder="Category Name" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>الاسم (AR)</Label>
                <Input {...register("nameAr")} placeholder="اسم الفئة" dir="rtl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea {...register("description")} placeholder="وصف الفئة..." rows={2} />
            </div>
            <div className="space-y-2">
              <Label>رابط الصورة</Label>
              <Input {...register("image")} placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="bg-pink-500 text-white hover:bg-pink-600">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? "حفظ" : "إضافة"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الفئة؟</AlertDialogTitle>
            <AlertDialogDescription>لن يتم حذف المنتجات المرتبطة بها.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
