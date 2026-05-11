"use client";

import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-card w-full max-w-[95%] mx-auto my-4 md:my-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-border flex flex-col items-center text-center overflow-hidden" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 relative z-10">
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
          من العناية اليومية <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500">إلى لمسات الجمال الساحرة،</span>
          <br className="hidden md:block" />
          <span className="text-muted-foreground font-bold text-lg md:text-2xl lg:text-4xl block mt-2 md:mt-4 tracking-normal">
            نوفر لكِ كل ما يبرز أنوثتك <br className="hidden md:block" />
            ويمنحك الثقة التي تستحقينها.
          </span>
        </h2>
      </div>

      <div className="group relative mt-8 md:-mt-20 w-full max-w-xs md:max-w-sm mx-auto h-[300px] md:h-[500px] lg:h-[600px] z-20 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_0_80px_rgba(255,158,203,0.3)]">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1780&auto=format&fit=crop"
          alt="Elegant Beauty"
          fill
          unoptimized
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
        />
      </div>
    </section>
  );
}
