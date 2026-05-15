"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, User, Mail, Phone, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Partner {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  _count?: {
    shares: number;
  };
}

interface Props {
  initialPartners: Partner[];
}

export default function PartnersClient({ initialPartners }: Props) {
  const [partners, setPartners] = useState(initialPartners);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add partner");
      
      toast.success("تم إضافة الشريك بنجاح");
      setIsAddOpen(false);
      // Fetch updated list
      const updated = await fetch("/api/partners").then(r => r.json());
      setPartners(updated);
      router.refresh();
    } catch (error) {
      toast.error("حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPartner) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch(`/api/partners/${selectedPartner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update partner");
      
      toast.success("تم تحديث بيانات الشريك");
      setIsEditOpen(false);
      // Fetch updated list
      const updated = await fetch("/api/partners").then(r => r.json());
      setPartners(updated);
      router.refresh();
    } catch (error) {
      toast.error("فشل التحديث");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الشريك؟ سيتم حذف جميع حصصه في المنتجات أيضاً.")) return;

    try {
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      
      toast.success("تم حذف الشريك");
      setPartners(partners.filter(p => p.id !== id));
      router.refresh();
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">إدارة الشركاء</h1>
          <p className="text-muted-foreground text-xs md:text-sm">أضف أسماء الشركاء والمساهمين لتوزيع الأرباح عليهم.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-pink-500 hover:bg-pink-600 gap-2 text-xs md:text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">إضافة شريك جديد</span><span className="sm:hidden">إضافة</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <Card key={partner.id} className="group hover:border-pink-200 transition-colors shadow-sm border border-border bg-card">
              <CardContent className="p-4 md:p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-lg">{partner.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      {partner.email && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {partner.email}
                        </div>
                      )}
                      {partner.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {partner.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      setSelectedPartner(partner);
                      setIsEditOpen(true);
                    }}
                    className="p-2 text-muted-foreground hover:text-pink-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
                <span className="text-muted-foreground">المنتجات المشارك فيها:</span>
                <span className="font-bold text-pink-600 dark:text-pink-400">{partner._count?.shares || 0}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">لم تقم بإضافة أي شركاء بعد.</p>
          <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-pink-600 mt-2">
            اضغط هنا لإضافة أول شريك
          </Button>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة شريك جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>اسم الشريك *</Label>
              <Input name="name" placeholder="مثال: محمد علي" required />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني (اختياري)</Label>
              <Input name="email" type="email" placeholder="partner@example.com" />
            </div>
            <div className="space-y-2">
              <Label>رقم الهاتف (اختياري)</Label>
              <Input name="phone" placeholder="05xxxxxxxx" />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>إلغاء</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-pink-500 hover:bg-pink-600 min-w-[100px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "إضافة الشريك"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الشريك</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <form onSubmit={handleEdit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>اسم الشريك *</Label>
                <Input name="name" defaultValue={selectedPartner.name} required />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input name="email" type="email" defaultValue={selectedPartner.email || ""} />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف</Label>
                <Input name="phone" defaultValue={selectedPartner.phone || ""} />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>إلغاء</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-pink-500 hover:bg-pink-600 min-w-[100px]">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ التغييرات"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
