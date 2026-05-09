import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueChart from "@/components/admin/RevenueChart";

interface Props {
  stats: {
    productCount: number;
    orderCount: number;
    totalRevenue: number;
  };
  lowStockProducts: {
    id: string;
    name: string;
    nameAr: string | null;
    stock: number;
    images: string[];
  }[];
  recentOrders: {
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: Date;
    items: { id: string }[];
  }[];
  yearlyOrders: { total: number; createdAt: Date }[];
}

const statusLabels: Record<string, string> = {
  PENDING: "معلق",
  PROCESSING: "جاري",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminDashboard({ stats, lowStockProducts, recentOrders, yearlyOrders }: Props) {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm mt-1">نظرة عامة على المتجر</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                <p className="text-3xl font-bold mt-1">{stats.productCount}</p>
              </div>
              <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center">
                <Package className="w-6 h-6 text-[#ff85ba]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-3xl font-bold mt-1">{stats.orderCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                <p className="text-3xl font-bold mt-1">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">الإيرادات الشهرية</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart orders={yearlyOrders} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-[#ff9ecb]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ff85ba]" />
                منتجات تحتاج تجديد المخزون
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-pink-50/50 dark:bg-pink-900/10 rounded-xl">
                  <p className="font-medium text-sm">{product.nameAr || product.name}</p>
                  <span className="text-xs font-bold text-[#ff85ba] bg-white px-2 py-1 rounded-full border border-pink-100">
                    {product.stock} متبقي
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">آخر الطلبات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">لا توجد طلبات بعد</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
