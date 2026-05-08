import { prisma } from "@/lib/prisma";
import ReportsClient from "@/components/admin/ReportsClient";

export default async function ReportsPage() {
  // 1. Fetch all admins
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
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
  admins.forEach(admin => {
    reportMap[admin.id] = {
      id: admin.id,
      name: admin.name || "مسؤول غير مسمى",
      email: admin.email,
      totalRevenue: 0,
      totalProfit: 0,
      totalSalesCount: 0,
      productCount: 0
    };
  });

  // 4. Calculate stats per admin
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
          if (reportMap[owner.userId]) {
            const sharePercentage = totalAmountPaid > 0 ? (owner.amount / totalAmountPaid) : 0;
            reportMap[owner.userId].totalRevenue += revenue * sharePercentage;
            reportMap[owner.userId].totalProfit += profit * sharePercentage;
            reportMap[owner.userId].totalSalesCount += item.quantity * sharePercentage;
          }
        });
      } else if (product.createdById && reportMap[product.createdById]) {
        // Single ownership: Default to creator
        reportMap[product.createdById].totalRevenue += revenue;
        reportMap[product.createdById].totalProfit += profit;
        reportMap[product.createdById].totalSalesCount += item.quantity;
      }
    });
  });

  // Count products per admin
  const products = await prisma.product.findMany({
    include: { owners: true }
  });
  
  products.forEach(p => {
    if (p.owners && p.owners.length > 0) {
      p.owners.forEach(o => {
        if (reportMap[o.userId]) reportMap[o.userId].productCount++;
      });
    } else if (p.createdById && reportMap[p.createdById]) {
      reportMap[p.createdById].productCount++;
    }
  });

  const reportData = Object.values(reportMap);

  return <ReportsClient initialData={reportData} />;
}
