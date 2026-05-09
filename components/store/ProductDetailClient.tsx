"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, MessageCircle, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  retailPrice: number;
  salePrice?: number | null;
  stock: number;
  featured: boolean;
  status: string;
  images: string[];
  sku: string | null;
  category: { name: string; nameAr: string | null } | null;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addItem } = useCartStore();

  const isOnSale = product.salePrice && product.salePrice < product.retailPrice;
  const sellingPrice = isOnSale ? product.salePrice! : product.retailPrice;

  const handleAddToCart = () => {
    // Note: The store's addItem currently handles quantity by +1 each call
    // We should call it 'quantity' times
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: sellingPrice,
        originalPrice: product.retailPrice,
        image: product.images[0] || "",
        stock: product.stock,
      });
    }
    toast.success(`تمت إضافة ${product.nameAr || product.name} إلى السلة`);
  };

  const handleWhatsAppOrder = async () => {
    if (!customerName || !customerPhone) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف لإتمام الطلب");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: [{
            productId: product.id,
            quantity: quantity,
            price: sellingPrice
          }]
        })
      });

      if (!response.ok) throw new Error("Failed to save order");

      // 2. Open WhatsApp
      const url = generateWhatsAppMessage(
        [{ name: product.name, nameAr: product.nameAr, quantity, price: sellingPrice }],
        "HALIZ",
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "218922613675"
      );
      
      setIsDialogOpen(false);
      toast.success("تم تسجيل طلبك بنجاح!");
      window.open(url, "_blank");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("حدث خطأ أثناء تسجيل الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Images */}
      <div className="space-y-3">
        <div className="group relative aspect-square rounded-3xl overflow-hidden bg-muted transition-all duration-700 hover:shadow-[0_0_80px_rgba(255,158,203,0.3)] border border-transparent hover:border-pink-200">
          {product.images[selectedImage] ? (
            <Image
              src={product.images[selectedImage]}
              alt={product.nameAr || product.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Package className="w-16 h-16 opacity-30" />
            </div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden bg-muted border-2 transition-all ${i === selectedImage ? "border-[#ff9ecb]" : "border-transparent hover:border-pink-300"}`}
              >
                <Image src={img} alt={`${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          {product.category && (
            <p className="text-[#ff85ba] text-sm font-medium">{product.category.nameAr || product.category.name}</p>
          )}
          {isOnSale && (
             <Badge className="bg-[#ff4d94] text-white rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
               تخفيض
             </Badge>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.nameAr || product.name}</h1>
          {product.sku && <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>}
        </div>

        <div className="flex flex-col gap-1 py-4 border-y border-pink-50/50">
          {isOnSale ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-lg line-through font-bold">
                {formatPrice(product.retailPrice)}
              </span>
              <Badge className="bg-[#ff4d94] text-white rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                توفير {formatPrice(product.retailPrice - product.salePrice!)}
              </Badge>
            </div>
          ) : null}
          <div className="flex items-center gap-4">
            <p className="text-5xl font-black text-[#ff85ba] tracking-tighter">
              {formatPrice(sellingPrice)}
            </p>
            {product.featured && (
              <Badge className="bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200 transition-colors">
                مميز ✨
              </Badge>
            )}
          </div>
        </div>

        {product.descriptionAr || product.description ? (
          <p className="text-gray-600 leading-relaxed text-lg">
            {product.descriptionAr || product.description}
          </p>
        ) : null}

        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <span className="text-sm font-black text-gray-500">الكمية المطلوبة:</span>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl border-pink-100 hover:bg-pink-50 text-pink-600" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center text-xl font-black text-gray-800">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl border-pink-100 hover:bg-pink-50 text-pink-600" 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} 
              disabled={quantity >= product.stock}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="mr-auto flex items-center gap-2 text-xs font-bold text-gray-400">
             <Package className="w-3.5 h-3.5" />
             {product.stock} قطع متوفرة
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="flex-1 btn-haliz rounded-2xl gap-2 py-8 text-lg shadow-xl shadow-pink-100/50"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-6 h-6" />
            {product.stock === 0 ? "نفذ من المخزون" : "أضف للسلة"}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 btn-haliz-outline rounded-2xl gap-2 py-8 text-lg border-pink-200"
              >
                <MessageCircle className="w-6 h-6" />
                اطلب عبر واتساب
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">إتمام الطلب عبر واتساب</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>الاسم بالكامل</Label>
                  <Input 
                    placeholder="اسم المستلم" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>رقم الهاتف</Label>
                  <Input 
                    placeholder="09X-XXXXXXX" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-xl gap-2"
                  onClick={handleWhatsAppOrder}
                  disabled={isSubmitting}
                >
                  <MessageCircle className="w-5 h-5" />
                  {isSubmitting ? "جاري الحفظ..." : "تأكيد وإرسال عبر واتساب"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-6 bg-pink-50/50 rounded-[2rem] text-sm space-y-3 border border-pink-100/50">
          <p className="flex items-center gap-3 text-pink-900 font-medium">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px]">✅</span>
            شحن سريع لجميع المدن
          </p>
          <p className="flex items-center gap-3 text-pink-900 font-medium">
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px]">💬</span>
            دعم فوري واستفسارات عبر واتساب
          </p>
        </div>
      </div>
    </div>
  );
}
