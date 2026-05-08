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
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1a1a1a]">التقارير المالية للشركاء</h1>
          <p className="text-gray-400 font-bold mt-2">متابعة دقيقة لمستحقات ومدفوعات كل مساهم في المتجر.</p>
        </div>
        <div className="bg-[#fff0f6] px-6 py-3 rounded-2xl border border-pink-100 flex items-center gap-3 soft-shadow">
          <span className="text-sm font-black text-pink-700">إجمالي المديونية للشركاء:</span>
          <span className="text-xl font-black text-[#ff85ba]">{formatPrice(overallRemaining)}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm bg-white rounded-[2rem] soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest">إجمالي مبيعات المتجر</CardTitle>
            <TrendingUp className="w-5 h-5 text-[#ff9ecb]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#1a1a1a]">{formatPrice(overallRevenue)}</div>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">بناءً على جميع الطلبات المكتملة</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white rounded-[2rem] soft-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest">إجمالي الأرباح المستحقة</CardTitle>
            <DollarSign className="w-5 h-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">{formatPrice(overallProfit)}</div>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">صافي أرباح الشركاء قبل الدفع</p>
          </CardContent>
        </Card>
      </div>

      {/* Admins Table */}
      <Card className="border-0 shadow-sm overflow-hidden rounded-[2.5rem] soft-shadow">
        <CardHeader className="border-b bg-[#fafafa]/50 p-8">
          <CardTitle className="text-xl font-black flex items-center gap-3">
            <Users className="w-6 h-6 text-[#ff9ecb]" />
            أداء ومستحقات الشركاء
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fcfcfc] border-b">
                <tr>
                  <th className="text-right px-8 py-5 font-black text-[11px] text-gray-400 uppercase tracking-wider">الشريك</th>
                  <th className="text-right px-8 py-5 font-black text-[11px] text-gray-400 uppercase tracking-wider text-center">المنتجات / المبيعات</th>
                  <th className="text-right px-8 py-5 font-black text-[11px] text-gray-400 uppercase tracking-wider">إجمالي الربح</th>
                  <th className="text-right px-8 py-5 font-black text-[11px] text-gray-400 uppercase tracking-wider">المستلم</th>
                  <th className="text-right px-8 py-5 font-black text-[11px] text-gray-400 uppercase tracking-wider">المتبقي</th>
                  <th className="text-center px-8 py-5 font-black text-[11px] text-gray-400 uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((admin) => (
                  <tr key={admin.id} className="border-b last:border-0 hover:bg-pink-50/20 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-[#1a1a1a]">{admin.name}</span>
                        <span className="text-[11px] text-gray-400 font-bold">{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#ff9ecb]" />
                          <span className="font-black text-pink-700">{admin.productCount}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{admin.totalSalesCount} قطعة مباعة</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-700">{formatPrice(admin.totalProfit)}</td>
                    <td className="px-8 py-6">
                      <span className="font-black text-blue-600">{formatPrice(admin.totalPaid)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`font-black text-lg ${admin.totalRemaining > 0 ? 'text-[#ff85ba]' : 'text-gray-300'}`}>
                        {formatPrice(admin.totalRemaining)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {admin.totalRemaining <= 0 ? (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-green-600 font-black text-[10px] uppercase tracking-wider border border-green-100">
                          تمت التسوية ✅
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#fff0f6] text-[#ff85ba] font-black text-[10px] uppercase tracking-wider border border-pink-100">
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
        <div className="text-center py-24 bg-[#fafafa] rounded-[3rem] border-2 border-dashed border-gray-100">
          <Users className="w-16 h-16 text-gray-200 mx-auto mb-6 opacity-50" />
          <p className="text-gray-400 font-bold">لا توجد بيانات متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
}

