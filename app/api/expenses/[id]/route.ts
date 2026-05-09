import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { title, amount, category, date, description, contributors } = body;

    const expenseAmount = parseFloat(amount);

    if (contributors && contributors.length > 0) {
      const totalContributions = contributors.reduce((acc: number, c: any) => acc + (c.amount || 0), 0);
      if (totalContributions > expenseAmount) {
        return NextResponse.json({ error: "Total contributions cannot exceed expense amount" }, { status: 400 });
      }
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        title,
        amount: expenseAmount,
        category,
        date: date ? new Date(date) : undefined,
        description,
        contributors: {
          deleteMany: {},
          create: (contributors || []).map((c: any) => ({
            partnerId: c.partnerId,
            amount: c.amount
          }))
        }
      },
      include: {
        contributors: { include: { partner: { select: { id: true, name: true } } } }
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.expense.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
