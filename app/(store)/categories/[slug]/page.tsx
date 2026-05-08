import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import Image from "next/image";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return { title: cat?.nameAr || cat?.name || "الفئة" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { products: { where: { status: "ACTIVE" }, include: { category: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!category) notFound();

  return (
    <div dir="rtl">
      {/* Banner */}
      {category.image && (
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <Image src={category.image} alt={category.nameAr || category.name} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 right-6">
            <h1 className="text-3xl font-bold text-white">{category.nameAr || category.name}</h1>
            <p className="text-white/80 text-sm">{category.products.length} منتج</p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {!category.image && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{category.nameAr || category.name}</h1>
            <p className="text-muted-foreground">{category.products.length} منتج</p>
          </div>
        )}
        {category.products.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">لا توجد منتجات في هذه الفئة</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
