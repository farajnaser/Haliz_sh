import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/store/CategoryCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "الفئات", description: "تصفح فئات منتجات هاليز" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-2">الفئات</h1>
      <p className="text-muted-foreground mb-8">اكتشف منتجاتنا حسب الفئة</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
      </div>
    </div>
  );
}
