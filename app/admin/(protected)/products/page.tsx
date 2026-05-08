import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/admin/ProductsClient";

export default async function AdminProductsPage() {
  const [products, categories, partners] = await Promise.all([
    prisma.product.findMany({
      include: { 
        category: true, 
        createdBy: { select: { name: true, email: true } },
        owners: { 
          include: { partner: true } 
        }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partner.findMany({ select: { id: true, name: true } })
  ]);
  return <ProductsClient initialProducts={products} categories={categories} partners={partners} />;
}
