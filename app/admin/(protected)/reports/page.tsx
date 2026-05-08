import { prisma } from "@/lib/prisma";
import ReportsClient from "@/components/admin/ReportsClient";

export default async function ReportsPage() {
  // 1. Fetch all partners
  const partners = await prisma.partner.findMany({
    select: { id: true, name: true, email: true }
  });

  // 2. Fetch all orders (except cancelled) with product details and owners
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    include: {
      items: {
        include: {
          product: {
            include: {
              owners: true
            }
          }
        }
      }
    }
  });

  // 3. Initialize report structure
  const reportMap: Record<string, any> = {};
  partners.forEach(partner => {
    reportMap[partner.id] = {
      id: partner.id,
      name: partner.name,
      email: partner.email || "بدون بريد",
      totalRevenue: 0,
      totalProfit: 0,
      totalSalesCount: 0,
      productCount: 0
    };
  });

  // 4. Calculate stats per partner
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = item.product;
      if (!product) return;

      const revenue = item.price * item.quantity;
      const profit = (item.price - product.wholesalePrice) * item.quantity;

      if (product.owners && product.owners.length > 0) {
        // Shared ownership: Distribute by contribution amount
        const totalAmountPaid = product.owners.reduce((acc, o) => acc + o.amount, 0);
        
        product.owners.forEach(owner => {
          if (reportMap[owner.partnerId]) {
            const sharePercentage = totalAmountPaid > 0 ? (owner.amount / totalAmountPaid) : 0;
            reportMap[owner.partnerId].totalRevenue += revenue * sharePercentage;
            reportMap[owner.partnerId].totalProfit += profit * sharePercentage;
            reportMap[owner.partnerId].totalSalesCount += item.quantity * sharePercentage;
          }
        });
      }
    });
  });

  // Count products per partner
  const products = await prisma.product.findMany({
    include: { owners: true }
  });
  
  products.forEach(p => {
    if (p.owners && p.owners.length > 0) {
      p.owners.forEach(o => {
        if (reportMap[o.partnerId]) reportMap[o.partnerId].productCount++;
      });
    }
  });

  const reportData = Object.values(reportMap);

  return <ReportsClient initialData={reportData} />;
}
