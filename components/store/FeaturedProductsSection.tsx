"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  retailPrice: number;
  images: string[];
  category?: { nameAr?: string | null; name: string } | null;
}

interface Props {
  products: Product[];
}

export default function FeaturedProductsSection({ products }: Props) {
  const [activeTab, setActiveTab] = useState("الكل");
  
  const tabs = ["الكل", "مكياج", "عناية بالبشرة", "إكسسوارات", "عطور (قريباً)"];

  // Filter products based on active tab
  const filteredProducts = activeTab === "الكل" 
    ? products 
    : products.filter(p => {
        const catName = (p.category?.name || "").toLowerCase();
        const catNameAr = (p.category?.nameAr || "").toLowerCase();
        const keyword = activeTab.replace(" (قريباً)", "").trim().toLowerCase();
        
        // Robust matching for skincare
        if (keyword.includes("عناية") || keyword.includes("بشرة")) {
          return catName.includes("skin") || catNameAr.includes("عناية") || catNameAr.includes("بشرة");
        }
        
        return catName.includes(keyword) || catNameAr.includes(keyword);
      });

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-pink-50 to-pink-100/60 dark:from-pink-900/10 dark:to-pink-900/20 w-full max-w-[95%] mx-auto my-6 md:my-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-pink-100 dark:border-pink-900/20 pb-28 md:pb-24" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter">
            منتجات متميزة
          </h2>
          <p className="text-muted-foreground font-bold max-w-xl text-center">
            تصفحي أحدث المنتجات وأرقى صيحات الموضة المختارة بعناية.
          </p>
          
          {/* Tabs — horizontally scrollable on mobile */}
          <div className="w-full overflow-x-auto scrollbar-hide mt-6 md:mt-8">
            <div className="flex gap-2 pb-1 min-w-max mx-auto px-1 justify-start md:justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-xs md:text-sm font-black transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab 
                      ? "bg-[#ff9ecb] text-white shadow-lg shadow-pink-100" 
                      : "bg-background dark:bg-card border border-border text-muted-foreground hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-[#ff85ba]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid — 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-12 flex items-center justify-center text-gray-400 font-bold">
              لا توجد منتجات في هذا القسم حالياً.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
