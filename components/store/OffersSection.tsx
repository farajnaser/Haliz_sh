"use client";

import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, Percent } from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  retailPrice: number;
  salePrice?: number | null;
  images: string[];
  category?: { nameAr?: string | null; name: string } | null;
}

interface Props {
  products: Product[];
}

export default function OffersSection({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 px-6 w-full max-w-[95%] mx-auto my-12 rounded-[3.5rem] bg-[#1a1a1a] relative overflow-hidden group/section shadow-2xl" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff4d94]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff4d94]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff4d94]/10 border border-[#ff4d94]/20 text-[#ff4d94]">
              <Percent className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">عروض حصرية لفترة محدودة</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              تخفيضات <span className="text-[#ff4d94]">HALIZ</span>
            </h2>
            <p className="text-gray-400 font-bold max-w-md text-lg">
              لا تفوتي الفرصة! قطع مختارة بأسعار استثنائية لإطلالة لا تنسى.
            </p>
          </div>
          
          <div className="flex gap-4">
             <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500">
               <ChevronRight className="w-6 h-6" />
             </button>
             <button className="w-14 h-14 rounded-full bg-[#ff4d94] flex items-center justify-center text-white hover:bg-[#ff85ba] transition-all duration-500 shadow-lg shadow-[#ff4d94]/20">
               <ChevronLeft className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-500">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {/* Footer Link */}
        <div className="mt-20 text-center">
          <button className="group/btn relative px-12 py-5 bg-white text-black font-black text-sm uppercase tracking-[0.2em] rounded-full hover:bg-[#ff4d94] hover:text-white transition-all duration-500 shadow-xl overflow-hidden">
             <span className="relative z-10">استكشفي جميع العروض</span>
             <div className="absolute inset-0 bg-gradient-to-r from-[#ff4d94] to-[#ff85ba] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </section>
  );
}
