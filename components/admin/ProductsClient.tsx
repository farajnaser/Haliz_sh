"use client";

import { useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon, Star, Package, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import ProductForm from "@/components/admin/ProductForm";
import Image from "next/image";
import { Product, Category } from "@/types/admin";



interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  partners: { id: string, name: string }[];
}

const statusLabels: Record<string, string> = {
  ACTIVE: "نشط",
  INACTIVE: "غير نشط",
  OUT_OF_STOCK: "نفذ",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  OUT_OF_STOCK: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProductsClient({ initialProducts, categories, partners }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Payout states
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isPayoutSubmitting, setIsPayoutSubmitting] = useState(false);
  const [payoutData, setPayoutData] = useState<{
    productId: string;
    partnerId: string;
    partnerName: string;
    currentPaid: number;
    earned: number;
  } | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<string>("");

  const handlePayout = async () => {
    if (!payoutData || !payoutAmount) return;
    setIsPayoutSubmitting(true);
    try {
      const res = await fetch(`/api/products/${payoutData.productId}/payout`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: payoutData.partnerId,
          amount: parseFloat(payoutAmount)
        })
      });

      if (!res.ok) throw new Error();
      
      const updatedProduct = await res.json();
      setProducts((prev) => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      
      toast.success("تم تسجيل الدفعة بنجاح");
      setIsPayoutDialogOpen(false);
      setPayoutAmount("");
    } catch {
      toast.error("حدث خطأ أثناء تسجيل الدفعة");
    } finally {
      setIsPayoutSubmitting(false);
    }
  };

  const handleSettleFull = async (productId: string, partnerId: string, earned: number) => {
    const product = products.find(p => p.id === productId);
    const owner = product?.owners?.find(o => o.partnerId === partnerId);
    if (!owner) return;

    const remaining = earned - (owner.paidProfit || 0);
    if (remaining <= 0) return;

    if (!confirm(`هل أنت متأكد من تسوية كامل المبلغ المتبقي (${formatPrice(remaining)})؟`)) return;

    try {
      const res = await fetch(`/api/products/${productId}/payout`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, amount: remaining })
      });

      if (!res.ok) throw new Error();
      
      const updatedProduct = await res.json();
      setProducts((prev) => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      toast.success("تمت التسوية الكاملة بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء التسوية");
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nameAr && p.nameAr.includes(search)) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    
    let matchesPartner = true;
    if (partnerFilter !== "ALL") {
      matchesPartner = p.owners?.some(o => o.partnerId === partnerFilter) || false;
    }

    return matchesSearch && matchesPartner;
  });

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deletingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== deletingId));
      toast.success("تم حذف المنتج بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleSaved = useCallback((savedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === savedProduct.id);
      if (exists) return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      return [savedProduct, ...prev];
    });
    setIsFormOpen(false);
    setEditingProduct(null);
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} منتج إجمالاً</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-pink-500 text-white hover:bg-pink-600 gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث بالاسم أو رقم SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 bg-card border-0 shadow-sm"
          />
        </div>
        
        <Select value={partnerFilter} onValueChange={setPartnerFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-card border-0 shadow-sm">
            <Users className="w-4 h-4 ml-2 text-pink-400" />
            <SelectValue placeholder="بحث حسب الشريك" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">جميع الشركاء</SelectItem>
            {partners.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">المنتج</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الفئة</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">سعر البيع</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">سعر الجملة</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الربح</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">المخزون</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الحالة</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الشركاء</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Package className="w-12 h-12 opacity-30" />
                        <p className="font-medium">لا توجد منتجات</p>
                        <p className="text-xs">اضغط "إضافة منتج" للبدء</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      {/* Product Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="font-medium line-clamp-1">{product.nameAr || product.name}</p>
                              {product.featured && (
                                <Star className="w-3 h-3 text-pink-500 fill-pink-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{product.sku || "—"}</p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-4 py-3 text-muted-foreground">
                        {product.category?.nameAr || product.category?.name || "—"}
                      </td>
                      {/* Retail Price */}
                      <td className="px-4 py-3 font-semibold">{formatPrice(product.retailPrice)}</td>
                      {/* Wholesale Price */}
                      <td className="px-4 py-3 text-muted-foreground">{formatPrice(product.wholesalePrice)}</td>
                      {/* Profit */}
                      <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">
                        +{formatPrice(product.profit)}
                      </td>
                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span className={product.stock <= 5 ? "text-red-500 font-semibold" : "text-foreground"}>
                          {product.stock}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}
                        >
                          {statusLabels[product.status]}
                        </span>
                      </td>
                      {/* Partners with Revenue & Payout Shares */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          {product.owners && product.owners.length > 0 ? (
                            (() => {
                              const totalContribution = product.owners.reduce((acc, o) => acc + o.amount, 0);
                              return product.owners.map((o, idx) => {
                                const sharePercent = totalContribution > 0 ? (o.amount / totalContribution) : 0;
                                // Amount due = Capital Investment + Share of Total Profit
                                const partnerEarned = o.amount + ((product.totalSalesProfit || 0) * sharePercent);
                                const partnerPaid = o.paidProfit || 0;
                                const partnerRemaining = partnerEarned - partnerPaid;

                                return (
                                  <div key={idx} className="flex flex-col bg-white p-3 rounded-2xl border border-pink-100/50 soft-shadow min-w-[160px]">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-black text-pink-700">{o.partner?.name || "شريك"}</span>
                                      <div className="flex gap-1">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSettleFull(product.id, o.partnerId, partnerEarned);
                                          }}
                                          title={partnerRemaining <= 0 ? "تمت التسوية بالكامل" : "تسوية كاملة"}
                                          className={`text-[10px] p-1 rounded-full transition-all border ${partnerRemaining <= 0 ? 'bg-green-500 text-white border-green-500' : 'bg-white text-green-600 border-green-200 hover:bg-green-500 hover:text-white'}`}
                                        >
                                          <Check className="w-3 h-3" />
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setPayoutData({
                                              productId: product.id,
                                              partnerId: o.partnerId,
                                              partnerName: o.partner?.name || "الشريك",
                                              currentPaid: partnerPaid,
                                              earned: partnerEarned
                                            });
                                            setIsPayoutDialogOpen(true);
                                          }}
                                          className="text-[10px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full hover:bg-pink-500 hover:text-white transition-all font-bold"
                                        >
                                          دفعة
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex flex-col text-[10px] gap-1">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">إجمالي الربح:</span>
                                        <span className="font-bold">{formatPrice(partnerEarned)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-blue-400">المستلم:</span>
                                        <span className="font-bold text-blue-600">{formatPrice(partnerPaid)}</span>
                                      </div>
                                      <div className="flex justify-between pt-1 border-t border-pink-50 mt-1">
                                        <span className="text-pink-400">المتبقي:</span>
                                        <span className={`font-black ${partnerRemaining > 0 ? 'text-green-600' : 'text-gray-300'}`}>
                                          {formatPrice(partnerRemaining)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              });
                            })()
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">لا يوجد شركاء</span>
                          )}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => setDeletingId(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            categories={categories}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSaved={handleSaved as any}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا المنتج نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payout Dialog */}
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-pink-700 flex items-center gap-2">
              <Users className="w-5 h-5" />
              تسجيل دفعة أرباح
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-gray-500">الشريك:</span>
                <span className="text-sm font-black text-pink-900">{payoutData?.partnerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500">إجمالي الأرباح المستحقة:</span>
                <span className="text-sm font-black text-green-600">{formatPrice(payoutData?.earned || 0)}</span>
              </div>
              <div className="flex justify-between items-center mt-1 pt-1 border-t border-pink-100/50">
                <span className="text-sm font-bold text-gray-500">تم استلام سابقاً:</span>
                <span className="text-sm font-black text-blue-600">{formatPrice(payoutData?.currentPaid || 0)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-pink-900">المبلغ المراد تسجيله كمدفوع (دينار ليبي):</label>
              <Input
                type="number"
                placeholder="أدخل المبلغ..."
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="rounded-xl border-pink-100 focus:ring-pink-200"
              />
              <p className="text-[10px] text-gray-400 font-bold italic">
                * سيتم تحديث إجمالي المبلغ المستلم بإضافة هذا المبلغ.
              </p>
            </div>

            <Button 
              onClick={handlePayout}
              disabled={isPayoutSubmitting || !payoutAmount}
              className="w-full btn-haliz"
            >
              {isPayoutSubmitting ? "جاري الحفظ..." : "تأكيد الدفع"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
