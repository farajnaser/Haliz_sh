"use client";

import {
  AreaChart,
  Area,
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
    <div className="w-full h-full min-h-[250px]">
      {!hasData && (
        <p className="text-sm text-muted-foreground text-center py-4 mb-2">
          لا توجد بيانات طلبات بعد. ستظهر الإيرادات هنا عند وصول الطلبات.
        </p>
      )}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff9ecb" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff9ecb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "currentColor" }}
            className="text-muted-foreground"
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "currentColor" }}
            className="text-muted-foreground"
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              color: "hsl(var(--foreground))"
            }}
            itemStyle={{ color: "#ff85ba", fontWeight: "bold" }}
            labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "4px" }}
            formatter={(value) => [`${value} د.ل`, "الإيرادات"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#ff9ecb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
