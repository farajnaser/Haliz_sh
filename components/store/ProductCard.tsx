"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface Props {
  product: {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    retailPrice: number;
    salePrice?: number | null;
    images: string[];
    category?: { nameAr?: string | null; name: string } | null;
  };
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const displayName = product.nameAr || product.name;
  const image = product.images?.[0];
  const isOnSale = product.salePrice && product.salePrice < product.retailPrice;
  const sellingPrice = isOnSale ? product.salePrice! : product.retailPrice;

  return (
    <div 
      onClick={() => router.push(`/products/${product.slug}`)}
      className="group flex flex-col bg-white overflow-hidden cursor-pointer rounded-[3rem] shadow-sm hover:shadow-[0_0_50px_rgba(255,158,203,0.25)] transition-all duration-500 border border-transparent hover:border-pink-200"
      dir="rtl"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#f8f9fa] rounded-t-[3rem]">
        {/* Badge Example (Optional) */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
           {isOnSale && (
             <span className="bg-[#ff4d94] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full shadow-lg">
               تخفيض
             </span>
           )}
           <span className="bg-[#1a1a1a] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-full">
             جديد
           </span>
        </div>
        
        {image ? (
          <Image
            src={image}
            alt={displayName}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-4xl opacity-10">✨</span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="space-y-3 px-6 pb-6">
        <div>
          <h3 className="text-[#1a1a1a] font-black text-lg tracking-tight mb-1 truncate">
            {displayName}
          </h3>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            {product.category?.nameAr || product.category?.name || "مجموعة حصرية"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
          <div className="flex flex-col">
            {isOnSale && (
              <span className="text-gray-400 text-[10px] line-through font-bold mb-1">
                {formatPrice(product.retailPrice)}
              </span>
            )}
            <span className={`${isOnSale ? 'text-[#ff4d94]' : 'text-[#1a1a1a]'} font-black text-xl leading-none`}>
              {formatPrice(sellingPrice)}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                id: product.id,
                name: displayName,
                price: sellingPrice,
                originalPrice: product.retailPrice,
                image: image || "",
                stock: 99,
              });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a1a] text-white hover:bg-[#ff9ecb] transition-all duration-300 shadow-md group/btn"
          >
            <Plus className="w-4 h-4 text-white group-hover/btn:rotate-90 transition-transform" />
            <span className="text-xs font-black tracking-wider">أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
