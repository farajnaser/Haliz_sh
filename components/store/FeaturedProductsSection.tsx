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
    <section className="py-24 px-6 bg-gradient-to-b from-[#fffafa] to-[#fff0f6] w-full max-w-[95%] mx-auto my-8 rounded-[3rem] shadow-sm border border-pink-50" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter">
            منتجات متميزة
          </h2>
          <p className="text-gray-400 font-bold max-w-xl text-center">
            تصفحي أحدث المنتجات وأرقى صيحات الموضة المختارة بعناية.
          </p>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-black transition-all duration-300 ${
                  activeTab === tab 
                    ? "bg-[#ff9ecb] text-white shadow-lg shadow-pink-100" 
                    : "bg-white border border-pink-100 text-gray-500 hover:bg-pink-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
