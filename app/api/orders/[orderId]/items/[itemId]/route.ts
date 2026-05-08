import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await req.json();
    const { isDiscounted, soldStatus } = body;

    const item = await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        isDiscounted: isDiscounted !== undefined ? isDiscounted : undefined,
        soldStatus: soldStatus !== undefined ? soldStatus : undefined,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update order item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
