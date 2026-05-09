import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, amount, category, date, description, contributors } = body;

    const expenseAmount = parseFloat(amount);

    if (!title || !expenseAmount) {
      return NextResponse.json({ error: "Title and amount are required" }, { status: 400 });
    }

    if (contributors && contributors.length > 0) {
      const totalContributions = contributors.reduce((acc: number, c: any) => acc + (c.amount || 0), 0);
      if (totalContributions > expenseAmount) {
        return NextResponse.json({ error: "Total contributions cannot exceed expense amount" }, { status: 400 });
      }
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: expenseAmount,
        category: category || "OTHER",
        date: date ? new Date(date) : new Date(),
        description,
        contributors: {
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

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Expense create error:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
