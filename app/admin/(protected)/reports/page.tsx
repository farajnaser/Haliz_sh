import { prisma } from "@/lib/prisma";
import ReportsClient from "@/components/admin/ReportsClient";

export default async function ReportsPage() {
  // 1. Fetch all partners with their shares and the paidProfit
  const partners = await prisma.partner.findMany({
    select: { 
      id: true, 
      name: true, 
      email: true,
      shares: {
        select: {
          productId: true,
          paidProfit: true,
          amount: true // contribution
        }
      }
    }
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
    // Total contribution capital from all products
    const totalCapital = partner.shares.reduce((acc, s) => acc + s.amount, 0);
    // Total amount the partner has already received
    const totalAlreadyPaid = partner.shares.reduce((acc, s) => acc + s.paidProfit, 0);

    reportMap[partner.id] = {
      id: partner.id,
      name: partner.name,
      email: partner.email || "بدون بريد",
      totalRevenue: 0,
      totalProfit: 0,
      totalWholesale: 0,
      totalDiscount: 0,
      totalCapital,
      totalPaid: totalAlreadyPaid,
      totalRemaining: 0,
      totalSalesCount: 0,
      productCount: 0
    };
  });

  // 4. Calculate stats per partner based on COMPLETED orders
  orders.forEach(order => {
    if (order.status !== "COMPLETED") return;

    order.items.forEach(item => {
      
      const product = item.product;
      if (!product) return;

      const revenue = item.price * item.quantity;
      const discount = (item.discountAmount || 0) * item.quantity;
      const wholesale = product.wholesalePrice * item.quantity;
      // Net Profit = (Retail - Discount - Wholesale)
      const profit = (item.price - (item.discountAmount || 0) - product.wholesalePrice) * item.quantity;

      if (product.owners && product.owners.length > 0) {
        const totalAmountPaid = product.owners.reduce((acc, o) => acc + o.amount, 0);
        
        product.owners.forEach(owner => {
          if (reportMap[owner.partnerId]) {
            const sharePercentage = totalAmountPaid > 0 ? (owner.amount / totalAmountPaid) : 0;
            reportMap[owner.partnerId].totalRevenue += revenue * sharePercentage;
            reportMap[owner.partnerId].totalWholesale += wholesale * sharePercentage;
            reportMap[owner.partnerId].totalDiscount += discount * sharePercentage;
            reportMap[owner.partnerId].totalProfit += profit * sharePercentage;
            reportMap[owner.partnerId].totalSalesCount += item.quantity * sharePercentage;
          }
        });
      }
    });
  });

  // 5. Final calculation: Total Profit (for display) should include Capital + Net Profit share
  // And Remaining = (Capital + Net Profit) - Total Already Paid
  Object.keys(reportMap).forEach(partnerId => {
    const data = reportMap[partnerId];
    // We add capital to totalProfit because user wants "Capital + Profit" as the entitled amount
    // But we check if sales > 0 to entitle capital as per previous rule
    if (data.totalSalesCount > 0) {
      data.totalEntitled = data.totalCapital + data.totalProfit;
    } else {
      data.totalEntitled = 0;
    }
    data.totalRemaining = Math.max(0, data.totalEntitled - data.totalPaid);
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
