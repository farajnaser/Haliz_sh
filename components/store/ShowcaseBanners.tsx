import Image from "next/image";
import Link from "next/link";

interface Banner {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

interface Props {
  banners: Banner[];
}

export default function ShowcaseBanners({ banners }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full" dir="rtl">
      {banners.map((banner, index) => (
        <Link 
          key={index} 
          href={banner.href}
          className="group relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-[3rem] soft-shadow border border-pink-50/50 hover:border-pink-300 transition-all duration-500 hover:shadow-[0_0_80px_rgba(255,158,203,0.2)]"
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          />
          {/* Elegant Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all duration-700" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-12 pb-16">
            <span className="text-[#ff9ecb] text-[10px] font-black uppercase tracking-[0.4em] mb-4 drop-shadow-sm">
              مجموعة حصرية
            </span>
            <h3 className="text-white text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-md">
              {banner.title}
            </h3>
            <p className="text-white/80 text-sm md:text-base mb-10 max-w-[320px] leading-relaxed font-bold">
              {banner.subtitle}
            </p>
            <div className="btn-haliz w-fit text-sm">
              اكتشفي الآن
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
