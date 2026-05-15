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
  const overallRemaining = sortedData.reduce((acc, curr) => acc + curr.totalRemaining, 0);

  return (
    <div className="space-y-6 md:space-y-8" dir="rtl">
      <div className="flex flex-col gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter text-[#1a1a1a] dark:text-foreground">التقارير المالية للشركاء</h1>
          <p className="text-gray-400 font-bold mt-1 md:mt-2 text-xs md:text-base">متابعة دقيقة لمستحقات ومدفوعات كل مساهم في المتجر.</p>
        </div>
        <div className="bg-pink-50 dark:bg-pink-900/20 px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-pink-100 dark:border-pink-900/30 flex items-center gap-2 md:gap-3 soft-shadow self-start">
          <span className="text-xs md:text-sm font-black text-pink-700 dark:text-pink-400">إجمالي المديونية:</span>
          <span className="text-base md:text-xl font-black text-[#ff85ba]">{formatPrice(overallRemaining)}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <Card className="border-0 shadow-sm bg-card rounded-2xl md:rounded-[2rem] soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">إجمالي المبيعات</CardTitle>
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#ff9ecb]" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-lg md:text-3xl font-black text-foreground">{formatPrice(overallRevenue)}</div>
            <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider hidden md:block">بناءً على جميع الطلبات المكتملة</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-card rounded-2xl md:rounded-[2rem] soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 px-4 md:px-6 pt-4 md:pt-6">
            <CardTitle className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">إجمالي الأرباح</CardTitle>
            <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-lg md:text-3xl font-black text-green-600 dark:text-green-400">{formatPrice(overallProfit)}</div>
            <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider hidden md:block">صافي أرباح الشركاء قبل الدفع</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Partner Cards */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-[#ff9ecb]" />
          <h2 className="text-base font-black">أداء ومستحقات الشركاء</h2>
        </div>
        {sortedData.length === 0 ? (
          <div className="text-center py-16 bg-muted/50 rounded-2xl border-2 border-dashed border-border">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-bold text-sm">لا توجد بيانات متاحة حالياً.</p>
          </div>
        ) : (
          sortedData.map((admin) => (
            <Card key={admin.id} className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                {/* Partner name & status */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-black text-sm">{admin.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{admin.email}</p>
                  </div>
                  {admin.totalRemaining <= 0 ? (
                    <span className="text-[9px] px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-black border border-green-100 dark:border-green-900/30">
                      تمت التسوية ✅
                    </span>
                  ) : (
                    <span className="text-[9px] px-2 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20 text-[#ff85ba] font-black border border-pink-100 dark:border-pink-900/30">
                      بانتظار الدفع ⏳
                    </span>
                  )}
                </div>
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3 h-3 text-[#ff9ecb]" />
                    <span className="text-muted-foreground">المنتجات:</span>
                    <span className="font-black text-pink-600 dark:text-pink-400">{admin.productCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">المبيعات:</span>
                    <span className="font-bold mr-1">{admin.totalSalesCount} قطعة</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الجملة:</span>
                    <span className="font-bold mr-1">{formatPrice(admin.totalWholesale)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الخصم:</span>
                    <span className="font-bold text-red-500 mr-1">-{formatPrice(admin.totalDiscount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">رأس المال:</span>
                    <span className="font-bold mr-1">{formatPrice(admin.totalCapital)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الربح:</span>
                    <span className="font-bold text-green-600 mr-1">+{formatPrice(admin.totalProfit)}</span>
                  </div>
                </div>
                {/* Bottom row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">المستحق: <b className="text-foreground">{formatPrice(admin.totalEntitled)}</b></span>
                    <span className="text-[10px] text-blue-400">المستلم: <b className="text-blue-600">{formatPrice(admin.totalPaid)}</b></span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-muted-foreground block">المتبقي</span>
                    <span className={`font-black text-base ${admin.totalRemaining > 0 ? 'text-[#ff85ba]' : 'text-muted-foreground'}`}>
                      {formatPrice(admin.totalRemaining)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <Card className="border-0 shadow-sm overflow-hidden rounded-[2.5rem] soft-shadow hidden md:block">
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
        <div className="text-center py-24 bg-muted/50 rounded-[3rem] border-2 border-dashed border-border hidden md:block">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <p className="text-muted-foreground font-bold">لا توجد بيانات متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
}
