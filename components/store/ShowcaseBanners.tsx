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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" dir="rtl">
      {banners.map((banner, index) => (
        <Link 
          key={index} 
          href={banner.href}
          className="group relative h-[450px] w-full overflow-hidden shadow-sm rounded-[2.5rem]"
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <h3 className="text-white text-3xl font-bold mb-4 tracking-wide">{banner.title}</h3>
            <p className="text-white/80 text-sm mb-8 max-w-[280px] leading-relaxed font-medium">
              {banner.subtitle}
            </p>
            <div className="bg-white text-black px-8 py-2.5 text-xs font-bold rounded-sm hover:bg-pink-500 hover:text-white transition-all duration-300">
              اطلب الآن
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
