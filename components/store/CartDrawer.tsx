"use client";

import { useCartStore } from "@/store/cartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  const handleWhatsAppCheckout = () => {
    const whatsappUrl = generateWhatsAppMessage(
      items.map((i) => ({
        name: i.name,
        nameAr: i.nameAr,
        quantity: i.quantity,
        price: i.price,
      })),
      "HALIZ",
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"
    );
    window.open(whatsappUrl, "_blank");
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
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-pink-600">{formatPrice(totalPrice())}</span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-5 text-base font-semibold rounded-2xl shadow-lg shadow-green-200 dark:shadow-none gap-2"
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle className="w-5 h-5" />
                اطلب عبر واتساب
              </Button>

              <Button variant="outline" className="w-full" onClick={clearCart}>
                إفراغ السلة
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
