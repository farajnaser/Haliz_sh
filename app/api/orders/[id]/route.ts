import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { customerName, customerPhone, notes, status, items } = body;

  const updateData: any = {};
  if (customerName) updateData.customerName = customerName;
  if (customerPhone) updateData.customerPhone = customerPhone;
  if (notes !== undefined) updateData.notes = notes;
  if (status) updateData.status = status;

  if (items && items.length > 0) {
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number; discountAmount?: number }) =>
        sum + (item.price * item.quantity) - (item.discountAmount || 0),
      0
    );
    updateData.total = total;
    updateData.items = {
      deleteMany: {},
      create: items.map((item: { productId: string; quantity: number; price: number; discountAmount?: number }) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discountAmount: item.discountAmount || 0,
      })),
    };
  }

  const order = await prisma.order.update({
    where: { id },
    data: updateData,
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
    },
  });
  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
