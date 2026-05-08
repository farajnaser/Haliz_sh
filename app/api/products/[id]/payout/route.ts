import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { partnerId, amount } = await request.json();

    if (!productId || !partnerId || typeof amount !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the ProductOwner record to increment paidProfit
    const updatedOwner = await prisma.productOwner.updateMany({
      where: {
        productId,
        partnerId
      },
      data: {
        paidProfit: {
          increment: amount
        }
      }
    });

    if (updatedOwner.count === 0) {
      return NextResponse.json({ error: "Partner not found for this product" }, { status: 404 });
    }

    // Return the updated product with all its data for UI sync
    const product = await prisma.product.findUnique({
      where: { id: productId },
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
      }
    });

    // Re-calculate the stats for the UI
    const totalSalesRevenue = product?.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
    const totalSalesProfit = product?.orderItems.reduce((acc, item) => acc + (((item.price - (item.discountAmount || 0)) - (product?.wholesalePrice || 0)) * item.quantity), 0) || 0;

    const productsWithRevenue = {
      ...product,
      totalSalesRevenue,
      totalSalesProfit
    };

    return NextResponse.json(productsWithRevenue);
  } catch (error) {
    console.error("[PAYOUT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
