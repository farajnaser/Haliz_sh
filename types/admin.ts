export interface Category {
  id: string;
  name: string;
  nameAr: string | null;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
  salePrice: number | null;
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
  createdBy?: { name: string | null; email: string } | null;
  owners?: { 
    partnerId: string; 
    amount: number; 
    paidProfit: number;
    partner?: { name: string | null; email: string | null } 
  }[];
  totalSalesRevenue?: number;
  totalSalesProfit?: number;
  createdAt: Date;
}

export interface Partner {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
}
