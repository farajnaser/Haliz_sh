"use client";

import { useMemo } from "react";
import ProductCard from "@/components/store/ProductCard";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  retailPrice: number;
  salePrice: number | null;
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
  const onSale = searchParams.get("onSale") === "true";
  const sort = searchParams.get("sort") || "newest";


  const filtered = useMemo(() => {
    let result = [...initialProducts];
    if (onSale) result = result.filter(p => p.salePrice && p.salePrice < p.retailPrice);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.nameAr && p.nameAr.includes(search)));
    if (selectedCategory !== "all") {
      result = result.filter(p => {
        if (!p.category) return false;
        
        const searchCat = selectedCategory.toLowerCase().trim();
        const catId = p.category.id.toLowerCase().trim();
        const catSlug = (p.category.slug || "").toLowerCase().trim();
        const catName = (p.category.name || "").toLowerCase().trim();
        const catNameAr = (p.category.nameAr || "").toLowerCase().trim();

        // 1. Direct ID or Slug match
        if (catId === searchCat || catSlug === searchCat) return true;

        // 2. Exact Name match
        if (catName === searchCat || catNameAr === searchCat) return true;

        // 3. Common Aliases & Robust Matching
        const isSkincareSearch = searchCat.includes("skin") || searchCat.includes("عناية") || searchCat.includes("بشرة");
        const isMakeupSearch = searchCat.includes("make") || searchCat.includes("مكياج");
        const isAccessorySearch = searchCat.includes("access") || searchCat.includes("اكسسوار") || searchCat.includes("إكسسوار");
        const isPerfumeSearch = searchCat.includes("perfume") || searchCat.includes("عطر");

        const isSkincareCat = catName.includes("skin") || catNameAr.includes("عناية") || catNameAr.includes("بشرة");
        const isMakeupCat = catName.includes("make") || catNameAr.includes("مكياج");
        const isAccessoryCat = catName.includes("access") || catNameAr.includes("اكسسوار") || catNameAr.includes("إكسسوار");
        const isPerfumeCat = catName.includes("perfume") || catNameAr.includes("عطر");

        if (isSkincareSearch && isSkincareCat) return true;
        if (isMakeupSearch && isMakeupCat) return true;
        if (isAccessorySearch && isAccessoryCat) return true;
        if (isPerfumeSearch && isPerfumeCat) return true;

        // 4. Substring fallback
        return catName.includes(searchCat) || catNameAr.includes(searchCat) || searchCat.includes(catName) || searchCat.includes(catNameAr);
      });
    }
    if (sort === "newest") result.sort(() => 0);
    else if (sort === "price-asc") result.sort((a, b) => a.retailPrice - b.retailPrice);
    else if (sort === "price-desc") result.sort((a, b) => b.retailPrice - a.retailPrice);
    return result;
  }, [initialProducts, search, selectedCategory, sort, onSale]);

  return (
    <div className="container mx-auto px-4 py-16" dir="rtl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-pink-900 dark:text-pink-200 uppercase tracking-tighter mb-2">المتجر</h1>
        <p className="text-[#ff85ba] font-bold text-xs uppercase tracking-widest">اكتشفي {filtered.length} قطعة مختارة بعناية</p>
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
              ? "bg-[#ff9ecb] text-white border-[#ff9ecb] shadow-lg shadow-pink-100" 
              : "bg-background dark:bg-card border border-border text-pink-900/60 dark:text-pink-300 hover:border-pink-300 hover:text-[#ff85ba]"
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
                  ? "bg-[#ff9ecb] text-white border-[#ff9ecb] shadow-lg shadow-pink-100" 
                  : "bg-background dark:bg-card border border-border text-pink-900/60 dark:text-pink-300 hover:border-pink-300 hover:text-[#ff85ba]"
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
