"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Save, Store, MessageCircle, Share2 } from "lucide-react";

interface Settings {
  id: string;
  storeName: string;
  storeNameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  whatsappNumber: string;
  instagram: string | null;
  twitter: string | null;
   facebook: string | null;
  tiktok: string | null;
  address: string | null;
  addressAr: string | null;
}

export default function SettingsClient({ settings }: { settings: Settings }) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: settings.storeName,
      storeNameAr: settings.storeNameAr || "",
      description: settings.description || "",
      descriptionAr: settings.descriptionAr || "",
      whatsappNumber: settings.whatsappNumber,
      instagram: settings.instagram || "",
      twitter: settings.twitter || "",
      facebook: settings.facebook || "",
      tiktok: settings.tiktok || "",
      address: settings.address || "",
      addressAr: settings.addressAr || "",
    },
  });

  const onSubmit = async (data: SettingsInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch { toast.error("حدث خطأ أثناء الحفظ"); }
    finally { setIsSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground text-sm">إعدادات المتجر العامة</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Store className="w-4 h-4" />معلومات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم المتجر (EN) *</Label>
              <Input {...register("storeName")} />
              {errors.storeName && <p className="text-xs text-red-500">{errors.storeName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>اسم المتجر (AR)</Label>
              <Input {...register("storeNameAr")} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الوصف (EN)</Label>
              <Textarea {...register("description")} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>الوصف (AR)</Label>
              <Textarea {...register("descriptionAr")} rows={2} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>العنوان (EN)</Label>
              <Input {...register("address")} />
            </div>
            <div className="space-y-2">
              <Label>العنوان (AR)</Label>
              <Input {...register("addressAr")} dir="rtl" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-500" />واتساب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>رقم واتساب *</Label>
            <Input {...register("whatsappNumber")} placeholder="966500000000" dir="ltr" />
            <p className="text-xs text-muted-foreground">أدخل الرقم بدون + مع رمز الدولة. مثال: 966501234567</p>
            {errors.whatsappNumber && <p className="text-xs text-red-500">{errors.whatsappNumber.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-500" />روابط التواصل الاجتماعي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input {...register("instagram")} placeholder="@haliz_store" dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>Twitter / X</Label>
            <Input {...register("twitter")} placeholder="@haliz_store" dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input {...register("facebook")} placeholder="haliz.store" dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>TikTok</Label>
            <Input {...register("tiktok")} placeholder="@haliz_store" dir="ltr" />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSaving} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white gap-2">
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        حفظ الإعدادات
      </Button>
    </form>
  );
}
