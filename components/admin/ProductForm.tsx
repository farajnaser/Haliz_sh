"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { calculateProfit, calculateRetailFromMargin } from "@/lib/utils";
import {
  Upload,
  X,
  Loader2,
  ImagePlus,
  Calculator,
  Users,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { Product, Category } from "@/types/admin";



interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSaved: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  categories,
  onSaved,
  onCancel,
}: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marginInput, setMarginInput] = useState("");
  const [partners, setPartners] = useState<{ id: string; name: string; email: string | null }[]>([]);
  const [owners, setOwners] = useState<{ partnerId: string; amount: number }[]>(
    product?.owners?.map(o => ({ partnerId: o.partnerId, amount: o.amount })) || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/partners")
      .then(res => res.json())
      .then(data => setPartners(data))
      .catch(err => console.error("Failed to fetch partners:", err));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
     
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: product?.name || "",
      nameAr: product?.nameAr || "",
      description: product?.description || "",
      descriptionAr: product?.descriptionAr || "",
      retailPrice: product?.retailPrice || 0,
      wholesalePrice: product?.wholesalePrice || 0,
      stock: product?.stock || 0,
      sku: product?.sku || "",
      barcode: product?.barcode || "",
      featured: product?.featured || false,
      salePrice: product?.salePrice || null,
      status: (product?.status as ProductInput["status"]) || "ACTIVE",
      categoryId: product?.categoryId || "",
      images: product?.images || [],
    },
  });

  const wholesalePrice = watch("wholesalePrice");
  const retailPrice = watch("retailPrice");
  const salePrice = watch("salePrice");
  
  const sellingPrice = (salePrice && salePrice < retailPrice) ? salePrice : (retailPrice || 0);
  const currentProfit = calculateProfit(sellingPrice, wholesalePrice || 0);

  // Apply profit margin calculator
  const applyMargin = () => {
    const margin = parseFloat(marginInput);
    if (!isNaN(margin) && wholesalePrice > 0) {
      const newRetail = calculateRetailFromMargin(wholesalePrice, margin);
      setValue("retailPrice", Math.round(newRetail * 100) / 100);
    }
  };

  // Upload single image
  const uploadImage = useCallback(async (file: File, index: number) => {
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`الصورة كبيرة جداً. الحد الأقصى ${maxSizeMB}MB`);
      return;
    }

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImages((prev) => {
        const next = [...prev];
        if (index < next.length) {
          next[index] = data.url;
        } else {
          next.push(data.url);
        }
        return next;
      });
      toast.success("تم رفع الصورة بنجاح");
    } catch (err) {
      toast.error("فشل رفع الصورة. تأكد من إضافة مفتاح ImgBB في Vercel وإعادة الرفع (Redeploy)");
      console.error(err);
    } finally {
      setUploadingIndex(null);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const startIndex = images.length;
    for (let i = 0; i < files.length; i++) {
      await uploadImage(files[i], startIndex + i);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, images, owners };
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      const saved = await res.json();
      toast.success(product ? "تم تعديل المنتج بنجاح" : "تم إضافة المنتج بنجاح");
      onSaved(saved);
    } catch (err) {
      toast.error((err as Error).message || "حدث خطأ ما");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6" dir="rtl">
      {/* ── Images Section ── */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">صور المنتج</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {/* Existing images */}
          {images.map((url, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 group"
            >
              <Image src={url} alt={`صورة ${i + 1}`} fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 left-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 right-1 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                  رئيسية
                </span>
              )}
            </div>
          ))}

          {/* Upload slot */}
          {uploadingIndex !== null ? (
            <div className="aspect-square rounded-xl bg-muted border-2 border-dashed border-pink-300 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl bg-muted hover:bg-muted/80 border-2 border-dashed border-muted-foreground/30 hover:border-pink-400 flex flex-col items-center justify-center gap-1 transition-all group"
            >
              <ImagePlus className="w-6 h-6 text-muted-foreground group-hover:text-pink-500 transition-colors" />
              <span className="text-xs text-muted-foreground group-hover:text-pink-500">
                أضف صورة
              </span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          رفع من الجهاز ({images.length} صورة)
        </Button>

        {/* Manual URL Input */}
        <div className="pt-4 border-t border-dashed">
          <Label className="text-sm font-medium mb-2 block">أو أضف رابط صورة مباشر (من فيسبوك أو أي موقع)</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="https://example.com/image.jpg" 
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value;
                  if (val) {
                    setImages(prev => [...prev, val]);
                    (e.target as HTMLInputElement).value = "";
                    toast.success("تم إضافة الرابط بنجاح");
                  }
                }
              }}
            />
            <Button 
              type="button" 
              variant="secondary"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value) {
                  setImages(prev => [...prev, input.value]);
                  input.value = "";
                  toast.success("تم إضافة الرابط بنجاح");
                }
              }}
            >
              إضافة رابط
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            انسخ رابط الصورة من أي موقع (مثل فيسبوك، انستغرام، أو ImgBB) وضعه هنا.
          </p>
        </div>
      </div>

      {/* ── Basic Info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنتج (EN) *</Label>
          <Input id="name" {...register("name")} placeholder="Product Name" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameAr">اسم المنتج (AR)</Label>
          <Input id="nameAr" {...register("nameAr")} placeholder="اسم المنتج بالعربي" dir="rtl" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">الوصف (EN)</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Product description..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionAr">الوصف (AR)</Label>
          <Textarea
            id="descriptionAr"
            {...register("descriptionAr")}
            placeholder="وصف المنتج بالعربي..."
            rows={3}
            dir="rtl"
          />
        </div>
      </div>

      {/* ── Pricing ── */}
      <div className="p-4 bg-muted/30 rounded-xl space-y-4 border border-dashed">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-pink-500" />
          <Label className="font-semibold">التسعير</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wholesalePrice">سعر الجملة (دينار ليبي) *</Label>
            <Input
              id="wholesalePrice"
              type="number"
              step="0.01"
              min="0"
              {...register("wholesalePrice")}
              placeholder="0.00"
            />
            {errors.wholesalePrice && (
              <p className="text-xs text-red-500">{errors.wholesalePrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="retailPrice">سعر البيع الأصلي (دينار ليبي) *</Label>
            <Input
              id="retailPrice"
              type="number"
              step="0.01"
              min="0"
              {...register("retailPrice")}
              placeholder="0.00"
            />
            {errors.retailPrice && (
              <p className="text-xs text-red-500">{errors.retailPrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice" className="text-pink-600 font-bold">سعر التخفيض (اختياري)</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              min="0"
              {...register("salePrice")}
              placeholder="اتركه فارغاً إذا لم يكن هناك تخفيض"
              className="border-pink-200 focus:ring-pink-300"
            />
          </div>
        </div>

        {/* Profit Margin Calculator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              type="number"
              placeholder="نسبة الربح %"
              value={marginInput}
              onChange={(e) => setMarginInput(e.target.value)}
              className="w-36"
            />
            <Button type="button" variant="outline" size="sm" onClick={applyMargin}>
              احسب السعر
            </Button>
          </div>
          {wholesalePrice > 0 && retailPrice > wholesalePrice && (
            <div className="text-sm">
              <span className="text-muted-foreground">الربح: </span>
              <span className="font-bold text-green-600">+{currentProfit.toFixed(2)} دينار ليبي</span>
              <span className="text-muted-foreground mr-1">
                ({((currentProfit / wholesalePrice) * 100).toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Owners/Partners Section ── */}
      <div className="p-4 bg-pink-50/30 rounded-xl space-y-4 border border-dashed border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-pink-500" />
            <Label className="font-semibold text-pink-700">شركاء المنتج (المساهمين)</Label>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="text-pink-600 border-pink-200 hover:bg-pink-50 gap-1"
            onClick={() => setOwners([...owners, { partnerId: "", amount: 0 }])}
          >
            <UserPlus className="w-3 h-3" />
            إضافة شريك
          </Button>
        </div>

        {owners.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">لا يوجد شركاء محددين. الربح سيحسب للمسؤول الحالي فقط.</p>
        ) : (
          <div className="space-y-3">
            {owners.map((owner, idx) => (
              <div key={idx} className="flex gap-3 items-end bg-white/50 p-3 rounded-lg border border-pink-100">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-[10px]">الشريك</Label>
                  <Select
                    value={owner.partnerId}
                    onValueChange={(val) => {
                      const newOwners = [...owners];
                      newOwners[idx].partnerId = val;
                      setOwners(newOwners);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="اختر الشريك..." />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map(partner => (
                        <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32 space-y-1.5">
                  <Label className="text-[10px]">المساهمة (دينار ليبي)</Label>
                  <Input
                    type="number"
                    className="h-9"
                    value={owner.amount}
                    onChange={(e) => {
                      const newOwners = [...owners];
                      newOwners[idx].amount = parseFloat(e.target.value) || 0;
                      setOwners(newOwners);
                    }}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-red-400 hover:text-red-600"
                  onClick={() => setOwners(owners.filter((_, i) => i !== idx))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {/* Calculation Hint */}
            <div className="pt-2 flex justify-between items-center text-xs">
              <div className="text-muted-foreground">
                إجمالي المساهمات: <span className="font-bold text-foreground">{owners.reduce((acc, o) => acc + o.amount, 0)} دينار ليبي</span>
              </div>
              {wholesalePrice > 0 && (
                <div className="text-pink-600 font-medium">
                  {owners.reduce((acc, o) => acc + o.amount, 0) < wholesalePrice && "⚠️ إجمالي المساهمات أقل من سعر الجملة"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Inventory ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">الكمية المتاحة *</Label>
          <Input id="stock" type="number" min="0" {...register("stock")} placeholder="0" />
          {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">رقم SKU</Label>
          <Input id="sku" {...register("sku")} placeholder="ACC-001" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barcode">الباركود</Label>
          <Input id="barcode" {...register("barcode")} placeholder="1234567890" />
        </div>
      </div>

      {/* ── Category & Status ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الفئة</Label>
            <Select
            defaultValue={product?.categoryId || "none"}
            onValueChange={(v) => setValue("categoryId", v === "none" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر فئة..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">بدون فئة</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.nameAr || cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>الحالة</Label>
          <Select
            defaultValue={product?.status || "ACTIVE"}
            onValueChange={(v) => setValue("status", v as ProductInput["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">نشط</SelectItem>
              <SelectItem value="INACTIVE">غير نشط</SelectItem>
              <SelectItem value="OUT_OF_STOCK">نفذ من المخزون</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Featured Toggle ── */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-dashed">
        <div>
          <p className="font-medium">منتج مميز</p>
          <p className="text-xs text-muted-foreground">يظهر في قسم المنتجات المميزة بالمتجر</p>
        </div>
        <Switch
          defaultChecked={product?.featured || false}
          onCheckedChange={(v) => setValue("featured", v)}
        />
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3 justify-start pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-500 text-white hover:bg-pink-600 min-w-[120px]"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : product ? (
            "حفظ التعديلات"
          ) : (
            "إضافة المنتج"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
