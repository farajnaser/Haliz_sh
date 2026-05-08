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
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100 min-h-[500px] flex items-center">
      
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      {/* Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-12 w-full" dir="rtl">
        
        {/* Text Side */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right">
          <span className="text-pink-500 font-bold tracking-wider mb-4 text-sm bg-pink-100/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
            كولكشن 2026 الجديد
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-pink-950 tracking-wide mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-pink-800 text-lg md:text-xl font-medium max-w-md leading-relaxed mb-8 opacity-90">
            {subtitle.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </p>
          <Link
            href={ctaHref}
            className="btn-haliz px-10 py-3.5 rounded-full hover:-translate-y-1"
          >
            {cta}
          </Link>
        </div>

        {/* Image Side */}
        <div className="flex-1 relative w-full flex items-center justify-center">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Soft backdrop glow behind image */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-full scale-90 shadow-xl shadow-pink-100/50 border border-white" />
            
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 z-10"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center z-10 relative">
                <span className="text-8xl opacity-30 animate-pulse">✨</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
