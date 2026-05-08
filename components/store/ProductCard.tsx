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
      className="group relative flex flex-col bg-transparent transition-all duration-500 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#fafafa] overflow-hidden mb-5 rounded-[2.5rem] soft-shadow border border-pink-50/50">
        {/* NEW Tag */}
        <div className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#ff85ba] rounded-full shadow-sm">
          جديد
        </div>
        
        {image ? (
          <Image
            src={image}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-10">✨</span>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 translate-y-4 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                id: product.id,
                name: displayName,
                price: product.retailPrice,
                image: image || "",
                stock: 99,
              });
              // toast.success("تم الإضافة للسلة");
            }}
            className="w-full bg-white text-black py-4 rounded-2xl text-[11px] font-black shadow-2xl flex items-center justify-center gap-2 hover:bg-[#ff9ecb] hover:text-white transition-all duration-300"
          >
            <ShoppingBag className="w-4 h-4" />
            أضيفي للسلة
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col text-center items-center px-4 space-y-1">
        <span className="text-[10px] text-[#ff85ba] font-black uppercase tracking-[0.2em]">
          {product.category?.nameAr || product.category?.name || "HALIZ"}
        </span>
        
        <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] group-hover:text-[#ff9ecb] transition-colors leading-tight line-clamp-1">
          {displayName}
        </h3>

        <div className="pt-1">
          <span className="text-base md:text-lg font-black text-[#1a1a1a]">
            {formatPrice(product.retailPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
