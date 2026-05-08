"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/store/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  retailPrice: number;
  stock: number;
  featured: boolean;
  status: string;
  images: string[];
  category: { id: string; name: string; nameAr: string | null; slug: string } | null;
}

interface Category { id: string; name: string; nameAr: string | null; slug: string; }

export default function ProductsPageClient({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const search = searchParams.get("q") || searchParams.get("search") || "";
  const selectedCategory = searchParams.get("cat") || "all";
  const sort = searchParams.get("sort") || "newest";
  const showFilters = false; // Simplified for now

  const filtered = useMemo(() => {
    let result = [...initialProducts];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.nameAr && p.nameAr.includes(search)));
    if (selectedCategory !== "all") {
      result = result.filter(p => {
        if (!p.category) return false;
        
        const searchCat = selectedCategory.toLowerCase().trim();
        const catId = p.category.id.toLowerCase();
        const catSlug = (p.category.slug || "").toLowerCase();
        const catName = (p.category.name || "").toLowerCase();
        const catNameAr = (p.category.nameAr || "").toLowerCase();

        // 1. Direct ID or Slug match
        if (catId === searchCat || catSlug === searchCat) return true;

        // 2. Exact Name match
        if (catName === searchCat || catNameAr === searchCat) return true;

        // 3. Common Alises & Typos
        const isSkincare = searchCat.includes("skin") || searchCat.includes("عناية") || searchCat.includes("بشرة") || searchCat.includes("شيرة");
        const isMakeup = searchCat.includes("make") || searchCat.includes("مكياج");
        const isAccessory = searchCat.includes("access") || searchCat.includes("اكسسوار") || searchCat.includes("إكسسوار");
        const isPerfume = searchCat.includes("perfume") || searchCat.includes("عطر");

        if (isSkincare && (catName.includes("skin") || catNameAr.includes("عناية") || catNameAr.includes("بشرة") || catNameAr.includes("شيرة"))) return true;
        if (isMakeup && (catName.includes("make") || catNameAr.includes("مكياج"))) return true;
        if (isAccessory && (catName.includes("access") || catNameAr.includes("اكسسوار") || catNameAr.includes("إكسسوار"))) return true;
        if (isPerfume && (catName.includes("perfume") || catNameAr.includes("عطر"))) return true;

        // 4. Substring fallback
        return catName.includes(searchCat) || catNameAr.includes(searchCat) || searchCat.includes(catName) || searchCat.includes(catNameAr);
      });
    }
    if (sort === "newest") result.sort((a, b) => 0);
    else if (sort === "price-asc") result.sort((a, b) => a.retailPrice - b.retailPrice);
    else if (sort === "price-desc") result.sort((a, b) => b.retailPrice - a.retailPrice);
    return result;
  }, [initialProducts, search, selectedCategory, sort]);

  return (
    <div className="container mx-auto px-4 py-16" dir="rtl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-pink-950 uppercase tracking-tighter mb-2">المتجر</h1>
        <p className="text-pink-400 font-bold text-xs uppercase tracking-widest">اكتشفي {filtered.length} قطعة مختارة بعناية</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن منتج..." 
            value={search} 
            onChange={e => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) params.set("search", e.target.value);
              else params.delete("search");
              router.push(`/products?${params.toString()}`);
            }} 
            className="pr-10 bg-card border-0 shadow-sm" 
          />
        </div>
        <Select 
          value={selectedCategory} 
          onValueChange={val => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("cat", val);
            router.push(`/products?${params.toString()}`);
          }}
        >
          <SelectTrigger className="w-44 bg-card border-0 shadow-sm"><SelectValue placeholder="الفئة" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map(cat => <SelectItem key={cat.id} value={cat.slug}>{cat.nameAr || cat.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select 
          value={sort} 
          onValueChange={val => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", val);
            router.push(`/products?${params.toString()}`);
          }}
        >
          <SelectTrigger className="w-44 bg-card border-0 shadow-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
            <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Luxury Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button 
          onClick={() => router.push("/products")} 
          className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
            selectedCategory === "all" 
              ? "bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200" 
              : "bg-white text-pink-900/60 border-pink-100 hover:border-pink-300 hover:text-pink-500"
          }`}
        >
          الكل
        </button>
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
          return (
            <button 
              key={cat.id} 
              onClick={() => router.push(`/products?cat=${cat.slug}`)} 
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                isSelected 
                  ? "bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200" 
                  : "bg-white text-pink-900/60 border-pink-100 hover:border-pink-300 hover:text-pink-500"
              }`}
            >
              {cat.nameAr || cat.name}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-16 h-16 mx-auto opacity-20 mb-4" />
          <p className="text-xl font-medium">لا توجد منتجات</p>
          <p className="text-sm mt-1">جرب البحث بكلمات أخرى</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
