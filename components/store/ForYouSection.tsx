"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

export default function ForYouSection({ products }: Props) {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-background w-full pb-28 md:pb-24" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 pb-4 border-b border-border">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tighter">
            مختاراتنا لكِ
          </h2>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-sm font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mt-4 sm:mt-0"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
