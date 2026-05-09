"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Users, TrendingUp, DollarSign, Package } from "lucide-react";

interface AdminReport {
  id: string;
  name: string;
  email: string;
  totalRevenue: number;
  totalWholesale: number;
  totalDiscount: number;
  totalProfit: number;
  totalCapital: number;
  totalEntitled: number;
  totalPaid: number;
  totalRemaining: number;
  totalSalesCount: number;
  productCount: number;
}

interface Props {
  initialData: AdminReport[];
}

export default function ReportsClient({ initialData }: Props) {
  // Sort by revenue descending
  const sortedData = [...initialData].sort((a, b) => b.totalProfit - a.totalProfit);

  const overallRevenue = sortedData.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const overallProfit = sortedData.reduce((acc, curr) => acc + curr.totalProfit, 0);
  const overallWholesale = sortedData.reduce((acc, curr) => acc + curr.totalWholesale, 0);
  const overallDiscount = sortedData.reduce((acc, curr) => acc + curr.totalDiscount, 0);
  const overallRemaining = sortedData.reduce((acc, curr) => acc + curr.totalRemaining, 0);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1a1a1a]">التقارير المالية للشركاء</h1>
          <p className="text-gray-400 font-bold mt-2">متابعة دقيقة لمستحقات ومدفوعات كل مساهم في المتجر.</p>
        </div>
        <div className="bg-pink-50 dark:bg-pink-900/20 px-6 py-3 rounded-2xl border border-pink-100 dark:border-pink-900/30 flex items-center gap-3 soft-shadow">
          <span className="text-sm font-black text-pink-700 dark:text-pink-400">إجمالي المديونية للشركاء:</span>
          <span className="text-xl font-black text-[#ff85ba]">{formatPrice(overallRemaining)}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm bg-card rounded-[2rem] soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">إجمالي مبيعات المتجر</CardTitle>
            <TrendingUp className="w-5 h-5 text-[#ff9ecb]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{formatPrice(overallRevenue)}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">بناءً على جميع الطلبات المكتملة</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card rounded-[2rem] soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">إجمالي الأرباح المستحقة</CardTitle>
            <DollarSign className="w-5 h-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600 dark:text-green-400">{formatPrice(overallProfit)}</div>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">صافي أرباح الشركاء قبل الدفع</p>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card className="border-0 shadow-sm overflow-hidden rounded-[2.5rem] soft-shadow">
        <CardHeader className="border-b border-border bg-muted/50 p-8">
          <CardTitle className="text-xl font-black flex items-center gap-3">
            <Users className="w-6 h-6 text-[#ff9ecb]" />
            أداء ومستحقات الشركاء
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-right px-8 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">الشريك</th>
                   <th className="text-right px-8 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider text-center">المنتجات / المبيعات</th>
                  <th className="text-right px-4 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">الجملة / الخصم</th>
                  <th className="text-right px-4 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">رأس المال / الربح</th>
                  <th className="text-right px-4 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">إجمالي المستحق</th>
                  <th className="text-right px-4 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">المستلم</th>
                  <th className="text-right px-4 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">المتبقي</th>
                  <th className="text-center px-4 py-5 font-black text-[11px] text-muted-foreground uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((admin) => (
                  <tr key={admin.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-foreground">{admin.name}</span>
                        <span className="text-[11px] text-muted-foreground font-bold">{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#ff9ecb]" />
                          <span className="font-black text-pink-600 dark:text-pink-400">{admin.productCount}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold">{admin.totalSalesCount} قطعة مباعة</span>
                      </div>
                    </td>
                     <td className="px-4 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground">الجملة: <b className="text-foreground">{formatPrice(admin.totalWholesale)}</b></span>
                        <span className="text-[11px] text-red-400">الخصم: <b className="text-red-500">-{formatPrice(admin.totalDiscount)}</b></span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-muted-foreground">رأس المال: <b className="text-foreground">{formatPrice(admin.totalCapital)}</b></span>
                        <span className="text-[11px] text-green-400">الربح: <b className="text-green-600">+{formatPrice(admin.totalProfit)}</b></span>
                      </div>
                    </td>
                    <td className="px-4 py-6 font-black text-foreground">{formatPrice(admin.totalEntitled)}</td>
                    <td className="px-4 py-6">
                      <span className="font-black text-blue-600 dark:text-blue-400">{formatPrice(admin.totalPaid)}</span>
                    </td>
                    <td className="px-4 py-6">
                      <span className={`font-black text-lg ${admin.totalRemaining > 0 ? 'text-[#ff85ba]' : 'text-muted-foreground'}`}>
                        {formatPrice(admin.totalRemaining)}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      {admin.totalRemaining <= 0 ? (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-black text-[10px] uppercase tracking-wider border border-green-100 dark:border-green-900/30">
                          تمت التسوية ✅
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-pink-50 dark:bg-pink-900/20 text-[#ff85ba] font-black text-[10px] uppercase tracking-wider border border-pink-100 dark:border-pink-900/30">
                          بانتظار الدفع ⏳
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {sortedData.length === 0 && (
        <div className="text-center py-24 bg-muted/50 rounded-[3rem] border-2 border-dashed border-border">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <p className="text-muted-foreground font-bold">لا توجد بيانات متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
}

