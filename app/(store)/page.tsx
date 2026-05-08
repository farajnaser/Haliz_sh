export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import HeroBanner from "@/components/store/HeroBanner";
import ShowcaseBanners from "@/components/store/ShowcaseBanners";
import ProductCard from "@/components/store/ProductCard";
import ServiceFeatures from "@/components/store/ServiceFeatures";
import OurStory from "@/components/store/OurStory";
import InstagramGallery from "@/components/store/InstagramGallery";
import Newsletter from "@/components/store/Newsletter";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default async function StoreHomePage() {
  // Fetch products: prioritizes featured ones, but fills with latest arrivals to ensure a full grid
  let featuredProducts = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: [
      { featured: "desc" }, // Featured first
      { createdAt: "desc" } // Then newest
    ],
    take: 12,
  });

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* 1. Hero Section */}
      <HeroBanner
        title="تألقي بجمالك الخاص"
        subtitle="اكتشفي مجموعتنا الحصرية من أرقى منتجات التجميل والعناية بالبشرة المصممة خصيصاً لإبراز أنوثتك"
        cta="تسوقي الآن"
        ctaHref="/products"
        image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80"
      />

      {/* 2. Soft Category Circles */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-pink-900 font-extralight text-2xl tracking-widest uppercase flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 text-pink-300" />
            اكتشفي الأقسام
            <Sparkles className="w-5 h-5 text-pink-300" />
          </h2>
        </div>
        <div className="flex justify-center gap-8 sm:gap-16 flex-wrap" dir="rtl">
          {[
            { id: "makeup", name: "مكياج", icon: "💄" },
            { id: "skincare", name: "عناية", icon: "✨" },
            { id: "accessories", name: "إكسسوار", icon: "💍" },
            { id: "perfumes", name: "عطور", icon: "🌸", soon: true },
          ].map((cat) => (
            <Link
              key={cat.id}
              href={cat.soon ? "#" : `/products?cat=${cat.id}`}
              className={`group flex flex-col items-center gap-4 relative ${cat.soon ? 'cursor-default opacity-60 pointer-events-none' : ''}`}
            >
              {cat.soon && (
                <span className="absolute -top-3 bg-pink-500/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-sm shadow-pink-200">
                  قريباً
                </span>
              )}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center text-4xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 shadow-[0_10px_40px_rgb(236,72,153,0.06)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className={`relative z-10 ${cat.soon ? "grayscale opacity-40" : ""}`}>{cat.icon}</span>
              </div>
              <span className="text-sm font-bold text-pink-900 group-hover:text-pink-500 transition-colors tracking-wide">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">

        {/* 3. Showcase Banners */}
        <section>
          <ShowcaseBanners banners={[
            {
              title: "عناية فائقة لبشرتك",
              subtitle: "مجموعة متكاملة من السيرومات والمرطبات لنضارة تدوم",
              image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80",
              href: "/products?cat=skincare"
            },
            {
              title: "لمسات ساحرة",
              subtitle: "أحدث تشكيلات المكياج العالمي بأسعار تنافسية",
              image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80",
              href: "/products?cat=makeup"
            }
          ]} />
        </section>

        {/* 4. Featured Products (Luxury Grid) */}
        <section dir="rtl">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111] mb-4">الأحذية والحقائب</h2>
            <p className="text-[#999] text-sm font-medium">تصاميم عصرية، جودة عالية، أناقة، تنوع، راحة</p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm shadow-pink-50 border border-pink-50">
              <span className="text-5xl opacity-20 mb-4 block">✨</span>
              <p className="text-pink-800/60 font-medium">قريباً سيتم توفير أحدث المنتجات</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-[#eee] text-[#222] hover:bg-black hover:text-white font-bold px-12 py-3 rounded-full text-xs transition-all duration-300"
            >
              تحميل المزيد من المنتجات
            </Link>
          </div>
        </section>

        {/* 5. Second Set of Banners */}
        <section>
          <ShowcaseBanners banners={[
            {
              title: "عالم المكياج",
              subtitle: "اكتشفي أحدث صيحات الجمال والمنتجات العالمية الأكثر طلباً",
              image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80",
              href: "/products?cat=makeup"
            },
            {
              title: "روتين العناية",
              subtitle: "دللي نفسك بمجموعة مختارة من أفضل المنتجات الطبيعية لبشرتك",
              image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80",
              href: "/products?cat=skincare"
            }
          ]} />
        </section>

        {/* 5. Our Story */}
        <OurStory />

        {/* 6. Inspiration Gallery */}
        <InstagramGallery />

        {/* 7. Service Features */}
        <ServiceFeatures />

        {/* 7. Newsletter */}
        <Newsletter />
      </div>
    </div>
  );
}
