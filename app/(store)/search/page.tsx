import { prisma } from "@/lib/prisma";
import ProductsPageClient from "@/components/store/ProductsPageClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "البحث", description: "ابحث في منتجات هاليز" };

export default async function SearchPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">جاري التحميل...</div>}>
      <ProductsPageClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
