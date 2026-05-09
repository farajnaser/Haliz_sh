import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [productCount, orderCount, totalRevenue, lowStockProducts, recentOrders, yearlyOrders, totalExpenses] =
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
      prisma.order.findMany({
        where: { createdAt: { gte: startOfYear }, status: "COMPLETED" },
        select: { total: true, createdAt: true },
      }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
    ]);

  return (
    <AdminDashboard
      stats={{
        productCount,
        orderCount,
        totalRevenue: totalRevenue._sum.total || 0,
        totalExpenses: totalExpenses._sum.amount || 0,
      }}
      lowStockProducts={lowStockProducts}
      recentOrders={recentOrders}
      yearlyOrders={yearlyOrders}
    />
  );
}
