import { prisma } from "@/lib/prisma";
import ExpensesClient from "@/components/admin/ExpensesClient";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
  });

  // Serialize dates for client component
  const serializedExpenses = expenses.map(e => ({
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return <ExpensesClient initialExpenses={serializedExpenses} />;
}
