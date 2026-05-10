"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, Heart, X, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  retailPrice: number;
}

interface Props {
  featuredProducts?: Product[];
}

// Hotspot Component
const Hotspot = ({ top, right, title, price, slug, delay }: any) => {
  return (
    <Link href={`/products/${slug}`} className={`absolute group flex flex-col items-center animate-in zoom-in ${delay} duration-700 z-20`} style={{ top, right }}>
      {/* Pulse Dot */}
      <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute w-full h-full bg-[#ff9ecb] rounded-full animate-ping opacity-75"></div>
        <div className="relative w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#ff9ecb] transition-transform group-hover:scale-150 cursor-pointer"></div>
      </div>

      {/* Glassmorphic Tooltip */}
      <div className="absolute top-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
        <div className="bg-card/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex flex-col items-center min-w-[140px] border border-border group-hover:bg-[#ff9ecb] transition-colors">
          <span className="text-foreground group-hover:text-white font-black text-sm whitespace-nowrap transition-colors">{title}</span>
          <span className="text-primary group-hover:text-white font-bold text-sm mt-1 transition-colors">{price}</span>
        </div>
      </div>
    </Link>
  );
};

export default function HeroBanner({ featuredProducts = [] }: Props) {
  const [exploreMode, setExploreMode] = useState(false);

  // Positions for up to 3 hotspots
  const positions = [
    { top: "30%", right: "35%", delay: "delay-100" },
    { top: "65%", right: "60%", delay: "delay-300" },
    { top: "45%", right: "75%", delay: "delay-500" },
  ];

  // ONLY map real products. If none, activeHotspots will be empty.
  const activeHotspots = featuredProducts.slice(0, 3).map((product, index) => ({
    ...product,
    ...positions[index]
  }));

  const hasProducts = activeHotspots.length > 0;

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-screen p-4 md:p-8 flex items-center justify-center bg-background" dir="rtl">
      {/* Background Card */}
      <div className="absolute inset-4 md:inset-8 z-0 rounded-[3rem] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop"
          alt="Style that moves with you"
          fill
          priority
          unoptimized
          className={`object-cover object-center transition-all duration-1000 ${exploreMode ? 'scale-105 blur-[2px] brightness-75' : 'scale-100 opacity-90'}`}
        />
        {/* subtle gradient to make text readable */}
        <div className={`absolute inset-0 transition-all duration-1000 ${exploreMode ? 'bg-black/50' : 'bg-gradient-to-t from-black/60 via-black/20 to-black/10'}`} />

        {/* Interactive Hotspots */}
        {exploreMode && hasProducts && (
          <div className="absolute inset-0 z-20">
            {activeHotspots.map((item) => (
              <Hotspot
                key={item.id}
                top={item.top}
                right={item.right}
                title={item.nameAr || item.name}
                price={`${item.retailPrice} د.ل`}
                slug={item.slug}
                delay={item.delay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content (Fades out in Explore Mode) */}
      <div className={`relative z-10 w-full pt-12 md:pt-20 text-center transition-all duration-700 ${exploreMode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <h1 className="text-6xl md:text-[8rem] lg:text-[11rem] font-black text-foreground leading-[0.8] tracking-tighter mx-auto max-w-5xl flex flex-col items-center select-none py-10" dir="ltr">
          <span className="block translate-x-3 md:translate-x-6 hover:translate-x-0 transition-transform duration-700">BEAUTY</span>
          <div className="relative flex items-center justify-center -my-4 md:-my-10 z-10 h-16 md:h-32">
            <span className="text-white text-5xl md:text-[8rem] lg:text-[12rem] italic font-serif font-normal drop-shadow-2xl animate-in zoom-in duration-1000">
              &
            </span>
          </div>
          <span className="block -translate-x-3 md:-translate-x-6 hover:translate-x-0 transition-transform duration-700">ELEGANCE</span>
        </h1>
        <div className="absolute left-10 md:left-32 top-1/2 transform -translate-y-1/2 hidden lg:block text-left max-w-[200px]" dir="ltr">
          <p className="text-white text-sm font-bold opacity-80 leading-tight text-right">
            استكشفي تشكيلتنا من أرقى منتجات المكياج والعناية بالبشرة، المصممة خصيصاً لكِ.
          </p>
        </div>
      </div>

      {/* Bottom Floating Badges (Fades out in Explore Mode) */}
      <div className={`absolute bottom-12 left-12 right-12 z-10 flex flex-col sm:flex-row justify-between items-end pb-4 transition-all duration-700 ${exploreMode ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}>

        {/* Right Badges (due to RTL) */}
        <div className="flex flex-col gap-4 items-start w-full sm:w-auto mb-6 sm:mb-0">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 space-x-reverse">
              <Image src="https://i.pravatar.cc/100?img=1" alt="user" width={32} height={32} className="rounded-full border-2 border-[#e0d6cd]" />
              <Image src="https://i.pravatar.cc/100?img=2" alt="user" width={32} height={32} className="rounded-full border-2 border-[#e0d6cd]" />
              <div className="w-8 h-8 rounded-full border-2 border-[#e0d6cd] bg-[#1a1a1a] flex items-center justify-center">
                <Heart className="w-3 h-3 text-[#ff9ecb] fill-[#ff9ecb]" />
              </div>
            </div>
            <div className="text-white text-xs font-bold leading-tight">
              <span>+200k</span><br />
              <span className="opacity-70">تقييم</span>
            </div>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-3 bg-foreground text-background px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#ff9ecb] hover:text-white transition-all duration-500 shadow-lg"
          >
            تسوقي الآن
            <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-foreground group-hover:bg-white group-hover:text-[#ff9ecb] transition-colors">
              <ArrowLeft className="w-3 h-3" />
            </div>
          </Link>
        </div>

        {/* Left Badge (due to RTL) - Only show if we have products to explore */}
        {hasProducts && (
          <div className="flex items-center justify-end w-full sm:w-auto">
            <button
              onClick={() => setExploreMode(true)}
              className="group flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#ff9ecb] hover:border-[#ff9ecb] transition-all duration-500 shadow-lg"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#ff9ecb] group-hover:text-white group-hover:bg-[#1a1a1a] transition-colors">
                <Search className="w-3 h-3" />
              </div>
              استكشفي
            </button>
          </div>
        )}
      </div>

      {/* Explore Mode Controls */}
      {exploreMode && (
        <div className="absolute top-16 right-16 z-30 animate-in fade-in slide-in-from-top-4 duration-700">
          <button
            onClick={() => setExploreMode(false)}
            className="group bg-white/20 hover:bg-white backdrop-blur-md border border-white/30 text-white hover:text-[#1a1a1a] px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 transition-all duration-500 shadow-xl"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            إغلاق الاستكشاف
          </button>
        </div>
      )}
    </section>
  );
}
