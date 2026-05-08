"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

interface Props {
  orders: { total: number; createdAt: Date }[];
}

export default function RevenueChart({ orders }: Props) {
  // Build monthly revenue from real orders
  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: MONTHS_AR[i],
    revenue: 0,
  }));

  orders.forEach((order) => {
    const month = new Date(order.createdAt).getMonth();
    monthly[month].revenue += order.total;
  });

  const hasData = orders.length > 0;

  return (
    <div>
      {!hasData && (
        <p className="text-sm text-muted-foreground text-center py-4 mb-2">
          لا توجد بيانات طلبات بعد. ستظهر الإيرادات هنا عند وصول الطلبات.
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={monthly} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value} دينار ليبي`, "الإيرادات"]}
          />
          <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
