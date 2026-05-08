import Link from "next/link";
import Image from "next/image";

interface Props {
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
  image?: string;
}

export default function HeroBanner({
  title,
  subtitle,
  cta = "تسوقي الآن",
  ctaHref = "/products",
  image,
}: Props) {
  return (
    <div className="relative w-full overflow-hidden bg-white min-h-[600px] md:min-h-[700px] flex items-center">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#fff0f6] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#fffafc] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 opacity-40" />

      {/* Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-16 w-full" dir="rtl">
        
        {/* Text Side */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right space-y-6">
          <span className="section-subtitle">إصدارات محدودة حصرياً</span>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#1a1a1a] leading-[1.1] tracking-tighter">
            {title}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed opacity-80">
            {subtitle}
          </p>
          <div className="pt-4">
            <Link
              href={ctaHref}
              className="btn-haliz text-lg"
            >
              {cta}
            </Link>
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 relative w-full flex items-center justify-center">
          <div className="relative w-full max-w-xl aspect-square">
            {/* Soft decorative ring */}
            <div className="absolute inset-0 border-[20px] border-[#ff9ecb]/5 rounded-full animate-[pulse_4s_infinite]" />
            
            <div className="relative w-full h-full p-10">
              {image ? (
                <div className="relative w-full h-full animate-[bounce_6s_infinite] duration-3000">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(255,158,203,0.3)] hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl opacity-10">✨</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
