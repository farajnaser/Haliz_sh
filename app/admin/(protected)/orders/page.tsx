import { prisma } from "@/lib/prisma";
import OrdersClient from "@/components/admin/OrdersClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  return <OrdersClient initialOrders={orders} />;
}
