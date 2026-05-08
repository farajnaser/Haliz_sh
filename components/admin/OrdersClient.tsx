"use client";

import { useState } from "react";
import { ShoppingCart, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatPrice, formatDate } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  isDiscounted: boolean;
  soldStatus: string;
  product: { 
    name: string; 
    nameAr: string | null;
    owners: { partner: Partner }[];
  };
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

export default function OrdersClient({ initialOrders, partners }: { initialOrders: Order[], partners: Partner[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [partnerFilter, setPartnerFilter] = useState("ALL");

  const filtered = orders.filter(order => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    let matchesPartner = true;
    if (partnerFilter !== "ALL") {
      // Check if any product in the order belongs to this partner
      matchesPartner = order.items.some(item => 
        item.product.owners.some(owner => owner.partner.id === partnerFilter)
      );
    }
    
    return matchesStatus && matchesPartner;
  });

  const updateItemStatus = async (orderId: string, itemId: string, data: any) => {
    try {
      await fetch(`/api/orders/${orderId}/items/${itemId}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      setOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          items: o.items.map(i => i.id === itemId ? { ...i, ...data } : i)
        };
      }));
      toast.success("تم تحديث حالة المنتج");
    } catch { toast.error("حدث خطأ"); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ status }) 
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success("تم تحديث حالة الطلب");
    } catch { toast.error("حدث خطأ"); }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <p className="text-muted-foreground text-sm">{orders.length} طلب إجمالاً</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={partnerFilter} onValueChange={setPartnerFilter}>
            <SelectTrigger className="w-44 bg-white border-pink-100 shadow-sm">
              <User className="w-4 h-4 ml-2 text-pink-400" />
              <SelectValue placeholder="بحث حسب الشريك" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">جميع الشركاء</SelectItem>
              {partners.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white border-pink-100 shadow-sm">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">جميع الحالات</SelectItem>
              <SelectItem value="PENDING">معلق</SelectItem>
              <SelectItem value="PROCESSING">جاري</SelectItem>
              <SelectItem value="COMPLETED">مكتمل</SelectItem>
              <SelectItem value="CANCELLED">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-pink-50">
          <ShoppingCart className="w-12 h-12 mx-auto opacity-10 mb-4" />
          <p className="text-muted-foreground">لا توجد طلبات تطابق اختياراتك</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <Card key={order.id} className="border-0 shadow-sm overflow-hidden group hover:ring-1 hover:ring-pink-100 transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Left Side: Order Info */}
                  <div className="flex-1 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold">{order.customerName}</h3>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-pink-50 pt-3">
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{order.customerPhone}</span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map(item => {
                        const productPartners = item.product.owners.map(o => o.partner.name).join(" + ");
                        return (
                          <div key={item.id} className={`bg-muted/30 p-4 rounded-2xl border ${item.soldStatus === 'SOLD' ? 'border-green-100' : 'border-pink-50'}`}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <span className="text-sm font-black block text-[#603b4b]">{item.product.nameAr || item.product.name} × {item.quantity}</span>
                                {productPartners && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-pink-500 font-bold mt-1">
                                    <User className="w-3 h-3" />
                                    الشريك: {productPartners}
                                  </div>
                                )}
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-black block text-pink-600">{formatPrice(item.price * item.quantity)}</span>
                                {item.isDiscounted && (
                                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">خصم</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Item Actions */}
                            <div className="flex items-center gap-3 pt-2 border-t border-pink-50/50">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id={`discount-${item.id}`}
                                  checked={item.isDiscounted}
                                  onChange={(e) => updateItemStatus(order.id, item.id, { isDiscounted: e.target.checked })}
                                  className="w-4 h-4 accent-pink-500"
                                />
                                <label htmlFor={`discount-${item.id}`} className="text-[10px] font-bold text-[#a0848f]">بيع بتخفيض</label>
                              </div>
                              
                              <div className="mr-auto flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant={item.soldStatus === 'SOLD' ? 'default' : 'outline'}
                                  className={`h-7 px-3 text-[10px] font-bold rounded-full ${item.soldStatus === 'SOLD' ? 'bg-green-500 hover:bg-green-600' : 'border-pink-100'}`}
                                  onClick={() => updateItemStatus(order.id, item.id, { soldStatus: item.soldStatus === 'SOLD' ? 'PENDING' : 'SOLD' })}
                                >
                                  {item.soldStatus === 'SOLD' ? 'تم البيع' : 'تحديد كـ مباع'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {order.notes && (
                      <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100/50">
                        <p className="text-xs text-yellow-800 italic">" {order.notes} "</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Actions */}
                  <div className="w-full sm:w-48 bg-pink-50/30 p-5 flex flex-col items-center justify-center gap-4 border-r border-pink-50">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">إجمالي الطلب</p>
                      <p className="text-2xl font-black text-pink-900">{formatPrice(order.total)}</p>
                    </div>
                    <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-full h-10 text-xs bg-white border-pink-100 rounded-full">
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
