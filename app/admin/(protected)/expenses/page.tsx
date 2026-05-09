import { prisma } from "@/lib/prisma";
import ExpensesClient from "@/components/admin/ExpensesClient";

export default async function ExpensesPage() {
  const [expenses, partners] = await Promise.all([
    prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: { 
        contributors: { 
          include: { partner: { select: { id: true, name: true } } } 
        } 
      }
    }),
    prisma.partner.findMany({ select: { id: true, name: true } })
  ]);

  // Serialize dates for client component
  const serializedExpenses = expenses.map(e => ({
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return <ExpensesClient initialExpenses={serializedExpenses} partners={partners} />;
}
