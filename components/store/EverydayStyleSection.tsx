import Link from "next/link";
import Image from "next/image";
import { Truck, ShieldCheck, ArrowLeft } from "lucide-react";

export default function EverydayStyleSection() {
  return (
    <section className="py-24 px-6 bg-muted/30 dark:bg-card/50 w-full max-w-[95%] mx-auto my-8 rounded-[3rem] shadow-sm border border-border overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight">
            مصمم لجمالك <span className="text-muted-foreground font-normal">اليومي</span>
          </h2>
          <p className="text-gray-400 font-bold max-w-2xl mx-auto text-lg">
            من العناية الأساسية إلى القطع الفريدة، نوفر لكِ منتجات تبرز جمالك الطبيعي كل يوم.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">

          {/* Left Side (Takes 2 columns on desktop) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Top Left Box */}
            <div className="bg-card p-10 flex flex-col items-center justify-center text-center space-y-6 hover:shadow-[0_0_40px_rgba(255,158,203,0.15)] transition-all duration-500 h-[280px] rounded-[3rem] border border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <h3 className="text-foreground text-xl font-black mb-2">جودة عالية</h3>
                <p className="text-muted-foreground text-sm font-bold">نضمن لك أصالة وجودة 100% لجميع منتجاتنا.</p>
              </div>
            </div>

            {/* Top Right Box */}
            <div className="bg-card p-10 flex flex-col items-center justify-center text-center space-y-6 hover:shadow-[0_0_40px_rgba(255,158,203,0.15)] transition-all duration-500 h-[280px] rounded-[3rem] border border-border">
              <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                <Truck className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <h3 className="text-foreground text-xl font-black mb-2">شحن لجميع المدن</h3>
                <p className="text-muted-foreground text-sm font-bold">نغطي كافة مناطق ليبيا مع توصيل مجاني عند تجاوز 500د.ل.</p>
              </div>
            </div>

            {/* Bottom - Pink Rectangular Box */}
            <div className="group sm:col-span-2 bg-[#ffcbb1] flex flex-col sm:flex-row items-center overflow-hidden h-auto sm:h-[280px] rounded-[3rem] transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,158,203,0.2)]">
              <div className="p-10 flex-1 space-y-4">
                <h3 className="text-[#1a1a1a] text-2xl md:text-3xl font-black leading-tight uppercase">
                  مجموعة العناية<br />الجديدة كلياً
                </h3>
                <Link href="/products" className="flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all w-fit shadow-xl">
                  تسوقي الآن
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex-1 relative w-full h-[200px] sm:h-full">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop"
                  alt="Skincare Collection"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

          </div>

          {/* Right Side (Takes 1 column on desktop) */}
          <div className="relative md:col-span-1 h-[400px] md:h-[584px] bg-[#e6dcd3] overflow-hidden group rounded-[3rem] transition-all duration-700 hover:shadow-[0_0_80px_rgba(255,158,203,0.3)] border border-transparent hover:border-pink-300">
            <Image
              src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&auto=format&fit=crop"
              alt="Originality"
              fill
              unoptimized
              className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Gradient Overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating White Box */}
            <div className="absolute top-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 text-center rounded-2xl">
              <span className="text-foreground text-sm font-black uppercase tracking-widest block mb-1">
                شعارنا
              </span>
              <h3 className="text-xl font-bold text-muted-foreground">
                الأصالة هي توقيعنا
              </h3>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-start">
              <Link href="/products" className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white hover:bg-[#ff9ecb] transition-all shadow-xl flex items-center justify-center">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
