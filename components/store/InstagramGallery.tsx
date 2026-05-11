import Image from "next/image";

const INSTAGRAM_ICON = (
  <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const gallery = [
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&auto=format&fit=crop",
];

export default function InstagramGallery() {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-muted/40 dark:bg-card w-full max-w-[95%] mx-auto my-4 md:my-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-border mb-20 md:mb-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <span className="text-[#ff9ecb] font-bold tracking-[0.2em] text-xs uppercase mb-3">انستغرام &amp; تيك توك</span>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-foreground tracking-tighter">
            إلهام HALIZ اليومي
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {gallery.map((img, i) => (
            <div key={i} className="group relative aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm hover:shadow-[0_0_50px_rgba(255,158,203,0.25)] transition-all duration-500 rounded-[3rem] border border-transparent hover:border-pink-100">
              <Image
                src={img}
                alt="Styled by you"
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-all duration-500 flex items-center justify-center">
                <div className="transition-all duration-500 p-4 bg-white/90 rounded-full text-[#ff9ecb] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_30px_rgba(255,158,203,0.3)]">
                  {INSTAGRAM_ICON}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
