import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string; itemId: string }> }
) {
  try {
    const { orderId, itemId } = await params;
    const body = await req.json();
    const { discountAmount, soldStatus } = body;

    // Update the item
    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        discountAmount: discountAmount !== undefined ? discountAmount : undefined,
        soldStatus: soldStatus !== undefined ? soldStatus : undefined,
      },
    });

    // Recalculate order total
    const allItems = await prisma.orderItem.findMany({
      where: { orderId }
    });

    const newTotal = allItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity) - (item.discountAmount || 0);
    }, 0);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { total: newTotal },
      include: { 
        items: { 
          include: { 
            product: { 
              include: { 
                owners: { include: { partner: true } } 
              } 
            } 
          } 
        } 
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
