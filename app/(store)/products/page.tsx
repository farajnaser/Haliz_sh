export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import ProductsPageClient from "@/components/store/ProductsPageClient";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "جميع المنتجات",
  description: "تصفح جميع منتجات هاليز للهدايا والاكسسوارات",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
      <ProductsPageClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
