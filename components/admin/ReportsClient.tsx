"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Users, TrendingUp, DollarSign, Package } from "lucide-react";

interface AdminReport {
  id: string;
  name: string;
  email: string;
  totalRevenue: number;
  totalProfit: number;
  totalSalesCount: number;
  productCount: number;
}

interface Props {
  initialData: AdminReport[];
}

export default function ReportsClient({ initialData }: Props) {
  // Sort by revenue descending
  const sortedData = [...initialData].sort((a, b) => b.totalRevenue - a.totalRevenue);

  const overallRevenue = sortedData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const overallProfit = sortedData.reduce((acc, curr) => acc + curr.totalProfit, 0);

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">التقارير المالية للمسؤولين</h1>
        <p className="text-muted-foreground mt-2">نظرة شاملة على مبيعات وأرباح كل مسؤول في المتجر.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm bg-pink-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي مبيعات المتجر</CardTitle>
            <TrendingUp className="w-4 h-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(overallRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">بناءً على جميع الطلبات غير الملغاة</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي أرباح المتجر</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatPrice(overallProfit)}</div>
            <p className="text-xs text-muted-foreground mt-1">صافي الربح بعد خصم سعر الجملة</p>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-500" />
            أداء المسؤولين
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">المسؤول</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">عدد المنتجات</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">القطع المباعة</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">إجمالي الإيرادات</th>
                  <th className="text-right px-6 py-4 font-semibold text-muted-foreground">صافي الربح</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((admin) => (
                  <tr key={admin.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{admin.name}</span>
                        <span className="text-xs text-muted-foreground">{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{admin.productCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{admin.totalSalesCount} قطعة</td>
                    <td className="px-6 py-4">
                      <span className="font-bold">{formatPrice(admin.totalRevenue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                        {formatPrice(admin.totalProfit)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {sortedData.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">لا توجد بيانات متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
}
