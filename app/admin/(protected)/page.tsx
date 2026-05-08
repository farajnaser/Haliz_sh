import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const [productCount, orderCount, totalRevenue, lowStockProducts, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "COMPLETED" } }),
      prisma.product.findMany({
        where: { stock: { lte: 5 }, status: "ACTIVE" },
        orderBy: { stock: "asc" },
        take: 5,
      }),
      prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <AdminDashboard
      stats={{
        productCount,
        orderCount,
        totalRevenue: totalRevenue._sum.total || 0,
      }}
      lowStockProducts={lowStockProducts}
      recentOrders={recentOrders}
    />
  );
}
