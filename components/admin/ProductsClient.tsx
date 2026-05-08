"use client";

import { useState, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon, Star, Package } from "lucide-react";
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

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
}

interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  retailPrice: number;
  wholesalePrice: number;
  profit: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  featured: boolean;
  status: string;
  images: string[];
  categoryId: string | null;
  category: Category | null;
  createdBy: { name: string | null; email: string } | null;
  createdAt: Date;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
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

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nameAr && p.nameAr.includes(search)) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="البحث بالاسم أو رقم SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10 bg-card border-0 shadow-sm"
        />
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
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">المسؤول</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
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
                      {/* Created By */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-pink-600">{product.createdBy?.name || "نظام"}</span>
                          <span className="text-[10px] text-muted-foreground">{product.createdBy?.email || ""}</span>
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
    </div>
  );
}
