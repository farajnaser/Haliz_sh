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
        },
        orderItems: {
          where: {
            soldStatus: "SOLD",
            order: {
              status: { not: "CANCELLED" }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.partner.findMany({ select: { id: true, name: true } })
  ]);

  // Calculate revenue per product to pass to client
  const productsWithRevenue = products.map(p => {
    const totalSalesRevenue = p.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalSalesProfit = p.orderItems.reduce((acc, item) => acc + (((item.price - (item.discountAmount || 0)) - p.wholesalePrice) * item.quantity), 0);
    
    return {
      ...p,
      totalSalesRevenue,
      totalSalesProfit
    };
  });

  return <ProductsClient initialProducts={productsWithRevenue} categories={categories} partners={partners} />;
}
