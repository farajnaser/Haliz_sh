"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseInput } from "@/lib/validations";
import { Plus, Pencil, Trash2, Receipt, Loader2, DollarSign, Megaphone, Truck, Home, Briefcase, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string | null;
}

const CATEGORIES = [
  { value: "MARKETING", label: "تسويق وإعلانات", icon: Megaphone, color: "text-blue-500 bg-blue-50" },
  { value: "SHIPPING", label: "شحن وتوصيل", icon: Truck, color: "text-orange-500 bg-orange-50" },
  { value: "RENT", label: "إيجار ومرافق", icon: Home, color: "text-purple-500 bg-purple-50" },
  { value: "SALARIES", label: "رواتب ومكافآت", icon: Briefcase, color: "text-green-500 bg-green-50" },
  { value: "OTHER", label: "مصاريف أخرى", icon: HelpCircle, color: "text-gray-500 bg-gray-50" },
];

export default function ExpensesClient({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      category: "OTHER",
      date: new Date().toISOString().split('T')[0]
    }
  });

  const openAdd = () => { setEditing(null); reset({ category: "OTHER", date: new Date().toISOString().split('T')[0] }); setIsFormOpen(true); };
  const openEdit = (exp: Expense) => {
    setEditing(exp);
    reset({ 
      title: exp.title, 
      amount: exp.amount, 
      category: exp.category, 
      date: exp.date.split('T')[0], 
      description: exp.description || "" 
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: ExpenseInput) => {
    setIsSubmitting(true);
    try {
      const url = editing ? `/api/expenses/${editing.id}` : "/api/expenses";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const saved = await res.json();
        if (!res.ok) throw new Error(saved.error || "فشل الحفظ");

        if (editing) {
          setExpenses(prev => prev.map(e => e.id === saved.id ? saved : e));
          toast.success("تم تحديث المصروف بنجاح");
        } else {
          setExpenses(prev => [saved, ...prev]);
          toast.success("تم إضافة المصروف بنجاح");
        }
        setIsFormOpen(false);
      } else {
        throw new Error(`Server error (${res.status})`);
      }
    } catch (err) { 
      toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/expenses/${deletingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("فشل الحذف");
      setExpenses(prev => prev.filter(e => e.id !== deletingId));
      toast.success("تم حذف المصروف بنجاح");
    } catch (err) { 
      toast.error(err instanceof Error ? err.message : "حدث خطأ أثناء الحذف"); 
    } finally { 
      setDeletingId(null); 
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">المصاريف والمدفوعات الجانبية</h1>
          <p className="text-muted-foreground text-sm">تتبع المصاريف التشغيلية، الإعلانات، والشحن</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card px-4 py-2 rounded-2xl border shadow-sm flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground font-bold">إجمالي المصاريف</span>
            <span className="text-lg font-black text-red-500">{formatPrice(totalExpenses)}</span>
          </div>
          <Button onClick={openAdd} className="bg-pink-500 text-white hover:bg-pink-600 gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-pink-100">
            <Plus className="w-5 h-5" /> إضافة مصروف
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-card rounded-[2rem] border-2 border-dashed">
            <Receipt className="w-16 h-16 mx-auto opacity-10 mb-4" />
            <p className="text-muted-foreground font-bold">لا توجد مصاريف مسجلة حالياً</p>
            <Button variant="link" onClick={openAdd} className="text-pink-500 font-bold mt-2">أضف أول مصروف الآن</Button>
          </div>
        ) : (
          expenses.map(exp => {
            const cat = CATEGORIES.find(c => c.value === exp.category) || CATEGORIES[4];
            const Icon = cat.icon;
            return (
              <Card key={exp.id} className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-all rounded-[2rem]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-pink-50 text-muted-foreground hover:text-pink-600" onClick={() => openEdit(exp)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500" onClick={() => setDeletingId(exp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-black text-lg line-clamp-1">{exp.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-bold">{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleDateString('ar-LY')}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-xl font-black text-red-500">{formatPrice(exp.amount)}</span>
                    {exp.description && (
                       <p className="text-[10px] text-muted-foreground italic max-w-[60%] line-clamp-1">{exp.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent dir="rtl" className="rounded-[2rem] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{editing ? "تعديل مصروف" : "إضافة مصروف جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="font-bold">عنوان المصروف *</Label>
              <Input {...register("title")} placeholder="مثلاً: إعلان فيسبوك شهر مايو" className="rounded-xl" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-bold">المبلغ (دينار ليبي) *</Label>
                <div className="relative">
                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input {...register("amount")} type="number" step="0.01" placeholder="0.00" className="pl-10 rounded-xl" />
                </div>
                {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold">التاريخ</Label>
                <Input {...register("date")} type="date" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">الفئة *</Label>
              <Select defaultValue={watch("category")} onValueChange={(v) => setValue("category", v)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="اختر الفئة..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-bold">ملاحظات إضافية</Label>
              <Textarea {...register("description")} placeholder="أضف تفاصيل إضافية هنا..." rows={3} className="rounded-xl" />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-pink-500 text-white hover:bg-pink-600 h-12 rounded-xl text-lg font-black">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editing ? "حفظ التعديلات" : "إضافة المصروف"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-12 px-8 rounded-xl font-bold">إلغاء</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent dir="rtl" className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">حذف هذا المصروف؟</AlertDialogTitle>
            <AlertDialogDescription className="font-bold">
              هل أنت متأكد من حذف هذا المصروف؟ سيؤثر ذلك على تقارير الأرباح والخسائر.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-3 mt-4">
            <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 rounded-xl" onClick={handleDelete}>حذف نهائي</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
