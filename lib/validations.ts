import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const productSchema = z.object({
  name: z.string().min(2, "اسم المنتج مطلوب"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  retailPrice: z.coerce.number().min(0),
  wholesalePrice: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).default("ACTIVE"),
  categoryId: z.string().optional(),
  images: z.array(z.string()).default([]),
});

export const categorySchema = z.object({
  name: z.string().min(2, "اسم الفئة مطلوب"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  image: z.string().optional(),
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(9),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().min(1),
    price: z.coerce.number().min(0),
  })),
});

export const settingsSchema = z.object({
  storeName: z.string().min(1),
  storeNameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  whatsappNumber: z.string().min(9),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  address: z.string().optional(),
  addressAr: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
