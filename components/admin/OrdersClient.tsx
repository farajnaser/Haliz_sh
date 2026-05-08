"use client";

import { useState } from "react";
import { ShoppingCart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; nameAr: string | null };
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: Date;
}

const statusLabels: Record<string, string> = {
  PENDING: "معلق", PROCESSING: "جاري", COMPLETED: "مكتمل", CANCELLED: "ملغي",
};
const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success("تم تحديث حالة الطلب");
    } catch { toast.error("حدث خطأ"); }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <p className="text-muted-foreground text-sm">{orders.length} طلب إجمالاً</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-card border-0 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">جميع الطلبات</SelectItem>
            <SelectItem value="PENDING">معلق</SelectItem>
            <SelectItem value="PROCESSING">جاري</SelectItem>
            <SelectItem value="COMPLETED">مكتمل</SelectItem>
            <SelectItem value="CANCELLED">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto opacity-30 mb-3" />
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <Card key={order.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{order.customerName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{order.customerPhone}</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    {order.items.length > 0 && (
                      <div className="space-y-1">
                        {order.items.map(item => (
                          <div key={item.id} className="text-sm flex justify-between">
                            <span>{item.product.nameAr || item.product.name} × {item.quantity}</span>
                            <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {order.notes && <p className="text-sm text-muted-foreground italic">"{order.notes}"</p>}
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                    <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">معلق</SelectItem>
                        <SelectItem value="PROCESSING">جاري المعالجة</SelectItem>
                        <SelectItem value="COMPLETED">مكتمل</SelectItem>
                        <SelectItem value="CANCELLED">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
