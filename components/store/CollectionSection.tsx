"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

// Custom precise SVGs for the categories
const LIPSTICK_ICON = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-[#ff4d8d]">
    <path d="M9 13v8h6v-8H9zm1-10c0-1 1-2 2-2s2 1 2 2v7h-4V3z" fill="currentColor"/>
    <path d="M7 21h10v2H7v-2z" fill="#1a1a1a"/>
    <path d="M8 13h8v3H8v-3z" fill="#fcd34d"/>
  </svg>
);

const SPARKLES_ICON = (
  <div className="relative">
    <Sparkles className="w-12 h-12 text-[#ff9ecb] fill-[#ff9ecb]" strokeWidth={1} />
    <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300 absolute -top-2 -right-2" strokeWidth={1} />
  </div>
);

const RING_ICON = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="15" r="5" stroke="#a78bfa" strokeWidth="2"/>
    <path d="M10 10L12 6L14 10H10Z" fill="#60a5fa"/>
  </svg>
);

const FLOWER_ICON = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-300">
    <path d="M12 22C12 22 9 17 9 14C9 12 11 11 12 11C13 11 15 12 15 14C15 17 12 22 12 22Z" fill="currentColor"/>
    <path d="M12 2C12 2 9 7 9 10C9 12 11 13 12 13C13 13 15 12 15 10C15 7 12 2 12 2Z" fill="currentColor"/>
    <path d="M2 12C2 12 7 9 10 9C12 9 13 11 13 12C13 13 12 15 10 15C7 15 2 12 2 12Z" fill="currentColor"/>
    <path d="M22 12C22 12 17 9 14 9C12 9 11 11 11 12C11 13 12 15 14 15C17 15 22 12 22 12Z" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="#e5e7eb"/>
  </svg>
);

const categories = [
  { id: "1", name: "مكياج", slug: "makeup", icon: LIPSTICK_ICON },
  { id: "2", name: "عناية", slug: "skincare", icon: SPARKLES_ICON },
  { id: "3", name: "إكسسوار", slug: "accessories", icon: RING_ICON },
  { id: "4", name: "عطور", slug: "perfumes", icon: FLOWER_ICON, badge: "قريباً" },
];

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
}

interface Props {
  categories?: Category[];
}

export default function CollectionSection({ categories: dbCategories }: Props) {
  // Use DB categories if available, otherwise fallback to hardcoded ones
  // We match hardcoded icons to DB categories by slug
  const displayCategories = dbCategories?.length 
    ? dbCategories.map(dbCat => {
        const hardcoded = categories.find(c => c.slug === dbCat.slug);
        return {
          id: dbCat.id,
          name: dbCat.nameAr || dbCat.name,
          slug: dbCat.slug,
          icon: hardcoded?.icon || SPARKLES_ICON, // Default icon if not matched
          badge: hardcoded?.badge
        };
      })
    : categories;

  return (
    <section className="py-24 px-6 bg-white w-full max-w-[95%] mx-auto my-8 rounded-[3rem] shadow-sm border border-pink-50" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Title */}
        <div className="flex items-center gap-4 mb-16">
          <Sparkles className="w-6 h-6 text-[#ff9ecb]" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-black text-[#603b4b] tracking-tighter">
            اكتشفي الأقسام
          </h2>
          <Sparkles className="w-6 h-6 text-[#ff9ecb]" strokeWidth={1.5} />
        </div>

        {/* Circular Grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 w-full">
          {displayCategories.map((cat) => {
            const isComingSoon = !!cat.badge;
            const content = (
              <>
                {/* Circle */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white flex items-center justify-center transition-all duration-500 shadow-[0_0_40px_rgba(255,158,203,0.15)] group-hover:shadow-[0_0_60px_rgba(255,158,203,0.4)] group-hover:-translate-y-3 group-hover:scale-105 border border-transparent group-hover:border-pink-100">
                  
                  {/* Badge */}
                  {cat.badge && (
                    <div className="absolute -top-2 md:-top-4 bg-[#ff9ecb] text-white text-xs font-black px-4 py-1.5 rounded-full drop-shadow-md z-10">
                      {cat.badge}
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="transform transition-transform duration-500 group-hover:scale-110">
                    {cat.icon}
                  </div>
                </div>

                {/* Label */}
                <span className="text-[#603b4b] text-xl font-black group-hover:text-[#ff9ecb] transition-colors">
                  {cat.name}
                </span>
              </>
            );

            if (isComingSoon) {
              return (
                <div 
                  key={cat.id} 
                  className="group flex flex-col items-center gap-6 cursor-not-allowed opacity-80"
                  title="قريباً"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link 
                key={cat.id} 
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center gap-6"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
