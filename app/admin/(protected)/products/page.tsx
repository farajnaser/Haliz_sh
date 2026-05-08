import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/admin/ProductsClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { 
        category: true, 
        createdBy: { select: { name: true, email: true } } 
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <ProductsClient initialProducts={products} categories={categories} />;
}
