"use client";

import { useState } from "react";
import { ShoppingCart, Phone, User, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatPrice, formatDate } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  discountAmount: number;
  soldStatus: string;
  product: { 
    id: string;
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



export default function OrdersClient({ initialOrders, partners, products }: { 
  initialOrders: Order[], 
  partners: Partner[],
  products: any[]
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [partnerFilter, setPartnerFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // New/Edit Order State
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    notes: "",
    items: [{ productId: "", quantity: 1, price: 0 }]
  });

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
      toast.dismiss();
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
      toast.dismiss();
      toast.success("تم تحديث حالة الطلب");
    } catch { toast.error("حدث خطأ"); }
  };

  const handleCreateOrder = async () => {
    if (!orderForm.customerName || !orderForm.customerPhone || orderForm.items.some(i => !i.productId)) {
      toast.error("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm)
      });

      if (!res.ok) throw new Error();
      const createdOrder = await res.json();
      
      setOrders(prev => [createdOrder, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.dismiss();
      toast.success("تم إضافة الطلب بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء إضافة الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!editingOrderId) return;
    if (!orderForm.customerName || !orderForm.customerPhone || orderForm.items.some(i => !i.productId)) {
      toast.error("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${editingOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm)
      });

      if (!res.ok) throw new Error();
      const updatedOrder = await res.json();
      
      setOrders(prev => prev.map(o => o.id === editingOrderId ? updatedOrder : o));
      setIsEditDialogOpen(false);
      resetForm();
      toast.dismiss();
      toast.success("تم تحديث الطلب بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء تحديث الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.dismiss();
      toast.success("تم حذف الطلب بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء حذف الطلب");
    }
  };

  const resetForm = () => {
    setOrderForm({
      customerName: "",
      customerPhone: "",
      notes: "",
      items: [{ productId: "", quantity: 1, price: 0 }]
    });
    setEditingOrderId(null);
  };

  const startEditing = (order: Order) => {
    setOrderForm({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      notes: order.notes || "",
      items: order.items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.price
      }))
    });
    setEditingOrderId(order.id);
    setIsEditDialogOpen(true);
  };

  const addItemRow = () => {
    setOrderForm(prev => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0 }]
    }));
  };

  const removeItemRow = (index: number) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItemRow = (index: number, field: string, value: any) => {
    setOrderForm(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Auto-set price if product changed
      if (field === "productId") {
        const product = products.find(p => p.id === value);
        if (product) newItems[index].price = product.retailPrice;
      }
      
      return { ...prev, items: newItems };
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الطلبات</h1>
          <p className="text-muted-foreground text-sm">{orders.length} طلب إجمالاً</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full gap-2">
                <Plus className="w-4 h-4" />
                إضافة طلب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle>إضافة طلب جديد يدوياً</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم الزبون</Label>
                        <Input 
                          value={orderForm.customerName}
                          onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))}
                          placeholder="الاسم الثلاثي"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>رقم الهاتف</Label>
                        <Input 
                          value={orderForm.customerPhone}
                          onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))}
                          placeholder="091XXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ملاحظات</Label>
                      <Textarea 
                        value={orderForm.notes}
                        onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))}
                        placeholder="ملاحظات إضافية..."
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-pink-600 font-bold">المنتجات المختارة</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addItemRow} className="h-8 rounded-full">
                          <Plus className="w-3 h-3 ml-1" /> إضافة منتج
                        </Button>
                      </div>
                      
                      {orderForm.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-pink-50/30 p-3 rounded-xl border border-pink-100">
                          <div className="flex-1 space-y-2">
                            <Label className="text-[10px]">المنتج</Label>
                            <Select value={item.productId} onValueChange={v => updateItemRow(idx, "productId", v)}>
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="اختر المنتج" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(p => (
                                  <SelectItem key={p.id} value={p.id}>{p.nameAr || p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-20 space-y-2">
                            <Label className="text-[10px]">الكمية</Label>
                            <Input 
                              type="number" 
                              className="h-9 text-xs"
                              value={item.quantity}
                              onChange={e => updateItemRow(idx, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="w-28 space-y-2">
                            <Label className="text-[10px]">السعر</Label>
                            <Input 
                              type="number" 
                              className="h-9 text-xs"
                              value={item.price}
                              onChange={e => updateItemRow(idx, "price", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          {orderForm.items.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400 hover:text-red-500" onClick={() => removeItemRow(idx)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>إلغاء</Button>
                    <Button onClick={handleCreateOrder} className="bg-pink-600 hover:bg-pink-700 text-white" disabled={isSubmitting}>
                      {isSubmitting ? "جاري الإضافة..." : "حفظ الطلب"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Order Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>تعديل الطلب</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم الزبون</Label>
                        <Input 
                          value={orderForm.customerName}
                          onChange={e => setOrderForm(p => ({ ...p, customerName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>رقم الهاتف</Label>
                        <Input 
                          value={orderForm.customerPhone}
                          onChange={e => setOrderForm(p => ({ ...p, customerPhone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ملاحظات</Label>
                      <Textarea 
                        value={orderForm.notes}
                        onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-pink-600 font-bold">المنتجات</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addItemRow} className="h-8 rounded-full">
                          <Plus className="w-3 h-3 ml-1" /> إضافة منتج
                        </Button>
                      </div>
                      
                      {orderForm.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-pink-50/30 p-3 rounded-xl border border-pink-100">
                          <div className="flex-1 space-y-2">
                            <Label className="text-[10px]">المنتج</Label>
                            <Select value={item.productId} onValueChange={v => updateItemRow(idx, "productId", v)}>
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(p => (
                                  <SelectItem key={p.id} value={p.id}>{p.nameAr || p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-20 space-y-2">
                            <Label className="text-[10px]">الكمية</Label>
                            <Input 
                              type="number" 
                              className="h-9 text-xs"
                              value={item.quantity}
                              onChange={e => updateItemRow(idx, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="w-28 space-y-2">
                            <Label className="text-[10px]">السعر</Label>
                            <Input 
                              type="number" 
                              className="h-9 text-xs"
                              value={item.price}
                              onChange={e => updateItemRow(idx, "price", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400" onClick={() => removeItemRow(idx)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>إلغاء</Button>
                    <Button onClick={handleUpdateOrder} className="bg-pink-600 hover:bg-pink-700 text-white" disabled={isSubmitting}>
                      {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

          <Select value={partnerFilter} onValueChange={setPartnerFilter}>
            <SelectTrigger className="w-44 bg-white border-pink-100 shadow-sm rounded-full">
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
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-pink-50 pt-3">
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{order.customerPhone}</span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map(item => {
                        const productPartners = item.product?.owners?.map((o: any) => o.partner?.name).filter(Boolean).join(" + ") || "";
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
                                {item.discountAmount > 0 && (
                                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                                    خصم {formatPrice(item.discountAmount)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Item Actions */}
                            <div className="flex items-center gap-4 pt-2 border-t border-pink-50/50">
                              <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                                <span className="text-[10px] font-bold text-[#a0848f] whitespace-nowrap">الخصم:</span>
                                <Input 
                                  type="number"
                                  className="h-7 text-[10px] px-2 border-pink-100 rounded-lg focus:ring-pink-200"
                                  value={item.discountAmount || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateItemStatus(order.id, item.id, { discountAmount: parseFloat(e.target.value) || 0 })}
                                  placeholder="0"
                                />
                              </div>
                              
                              <div className="mr-auto">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                  {order.status === 'COMPLETED' ? 'تم البيع' : 'في انتظار الاكتمال'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {order.notes && (
                      <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100/50">
                        <p className="text-xs text-yellow-800 italic">&quot; {order.notes} &quot;</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Actions */}
                  <div className="w-full sm:w-48 bg-pink-50/30 p-5 flex flex-col items-center justify-center gap-4 border-r border-pink-50">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">إجمالي الطلب</p>
                      <p className="text-2xl font-black text-pink-900">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
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
                      <Button variant="outline" size="sm" className="w-full h-10 rounded-full border-pink-100 text-pink-600 hover:bg-pink-50" onClick={() => startEditing(order)}>
                        تعديل الطلب
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full h-10 rounded-full text-red-400 hover:text-red-500 hover:bg-red-50 gap-2" onClick={() => handleDeleteOrder(order.id)}>
                        <Trash2 className="w-4 h-4" />
                        حذف الطلب
                      </Button>
                    </div>
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
