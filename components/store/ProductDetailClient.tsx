"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, MessageCircle, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  retailPrice: number;
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
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.retailPrice,
        image: product.images[0] || "",
        stock: product.stock,
      });
    }
    toast.success(`تمت إضافة ${product.nameAr || product.name} إلى السلة`);
  };

  const handleWhatsApp = () => {
    const url = generateWhatsAppMessage(
      [{ name: product.name, nameAr: product.nameAr, quantity, price: product.retailPrice }],
      "HALIZ",
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"
    );
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Images */}
      <div className="space-y-3">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
          {product.images[selectedImage] ? (
            <Image
              src={product.images[selectedImage]}
              alt={product.nameAr || product.name}
              fill
              className="object-cover"
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
                className={`relative aspect-square rounded-xl overflow-hidden bg-muted border-2 transition-all ${i === selectedImage ? "border-pink-500" : "border-transparent hover:border-pink-300"}`}
              >
                <Image src={img} alt={`${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-6">
        {product.category && (
          <p className="text-pink-600 text-sm font-medium">{product.category.nameAr || product.category.name}</p>
        )}
        <div>
          <h1 className="text-3xl font-bold">{product.nameAr || product.name}</h1>
          {product.sku && <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-4xl font-bold text-pink-600">{formatPrice(product.retailPrice)}</p>
          {product.featured && <Badge className="bg-pink-500 text-white">مميز</Badge>}
        </div>

        {product.descriptionAr || product.description ? (
          <p className="text-muted-foreground leading-relaxed">
            {product.descriptionAr || product.description}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">الكمية:</span>
          <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">{product.stock} متاح</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 rounded-2xl gap-2 py-6 text-base"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? "نفذ من المخزون" : "أضف للسلة"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-2xl border-green-300 text-green-700 hover:bg-green-50 gap-2 py-6 text-base"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-5 h-5" />
            اطلب عبر واتساب
          </Button>
        </div>

        <div className="p-4 bg-muted/50 rounded-2xl text-sm space-y-2">
          <p className="flex items-center gap-2">✅ شحن سريع</p>
          <p className="flex items-center gap-2">🔄 إرجاع مجاني خلال 7 أيام</p>
          <p className="flex items-center gap-2">💬 دعم فوري عبر واتساب</p>
        </div>
      </div>
    </div>
  );
}
