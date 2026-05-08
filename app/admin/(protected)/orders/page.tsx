import { prisma } from "@/lib/prisma";
import OrdersClient from "@/components/admin/OrdersClient";

export default async function AdminOrdersPage() {
  const [orders, partners] = await Promise.all([
    prisma.order.findMany({
      include: { 
        items: { 
          include: { 
            product: { 
              include: { 
                owners: { 
                  include: { partner: true } 
                } 
              } 
            } 
          } 
        } 
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.partner.findMany({
      select: { id: true, name: true }
    })
  ]);

  return <OrdersClient initialOrders={orders} partners={partners} />;
}
