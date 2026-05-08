"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    retailPrice: number;
    images: string[];
    category?: { nameAr?: string | null; name: string } | null;
  };
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const displayName = product.nameAr || product.name;
  const image = product.images?.[0];

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden mb-4 rounded-3xl">
        {/* HALIZ Tag - PINK */}
        <div className="absolute top-4 left-4 z-20 bg-[#ff9ecb] px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-white shadow-sm rounded-sm">
          HALIZ
        </div>
        
        {image ? (
          <Image
            src={image}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-10">✨</span>
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-30">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // CRITICAL: Stop the card click from firing
              addItem({
                id: product.id,
                name: displayName,
                price: product.retailPrice,
                image: image || "",
                stock: 99,
              });
            }}
            className="w-full bg-white/90 backdrop-blur-md text-black py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#ff9ecb] hover:text-white pointer-events-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            أضيفي للسلة
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col text-center items-center px-2">
        <h3 className="text-[13px] font-medium text-[#222] group-hover:text-pink-600 transition-colors leading-tight mb-1 line-clamp-1">
          {displayName}
        </h3>
        
        <p className="text-[11px] text-[#999] mb-2 font-medium">
          {product.category?.nameAr || product.category?.name || "HALIZ"}
        </p>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[14px] font-bold text-[#111]">
            {formatPrice(product.retailPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
