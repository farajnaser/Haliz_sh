"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWhatsAppCheckout = async () => {
    if (!customerName || !customerPhone) {
      toast.error("يرجى إدخال الاسم ورقم الهاتف لإتمام الطلب");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save order to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: items.map(i => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price
          }))
        })
      });

      if (!response.ok) throw new Error("Failed to save order");

      // 2. Open WhatsApp
      const whatsappUrl = generateWhatsAppMessage(
        items.map((i) => ({
          name: i.name,
          nameAr: i.nameAr,
          quantity: i.quantity,
          price: i.price,
        })),
        "HALIZ",
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "218922612675"
      );

      // 3. Clear cart and close
      clearCart();
      closeCart();
      toast.success("تم تسجيل طلبك بنجاح!");
      
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col" dir="rtl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-pink-500" />
            سلة التسوق
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length} منتج)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingCart className="w-16 h-16 opacity-20" />
            <p className="font-medium">السلة فارغة</p>
            <p className="text-sm text-center">أضف منتجات لبدء الطلب</p>
            <Button variant="outline" onClick={closeCart}>تصفح المنتجات</Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{item.nameAr || item.name}</p>
                    <p className="text-pink-600 font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-500 mr-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-6 pt-4">
              {/* Customer Info Form */}
              <div className="space-y-4 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
                <p className="text-sm font-black text-[#603b4b]">معلومات الشحن</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-[#a0848f]">الاسم بالكامل</Label>
                    <Input 
                      id="name" 
                      placeholder="اسم المستلم" 
                      className="rounded-xl border-pink-100 focus-visible:ring-pink-300"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-[#a0848f]">رقم الهاتف</Label>
                    <Input 
                      id="phone" 
                      placeholder="09X-XXXXXXX" 
                      className="rounded-xl border-pink-100 focus-visible:ring-pink-300"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-lg font-bold px-2">
                <span>الإجمالي</span>
                <span className="text-pink-600">{formatPrice(totalPrice())}</span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-base font-semibold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none gap-2"
                onClick={handleWhatsAppCheckout}
                disabled={isSubmitting}
              >
                <MessageCircle className="w-5 h-5" />
                {isSubmitting ? "جاري تسجيل الطلب..." : "تأكيد الطلب عبر واتساب"}
              </Button>

              <Button variant="outline" className="w-full rounded-2xl border-pink-100 text-[#a0848f]" onClick={clearCart}>
                إفراغ السلة
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
