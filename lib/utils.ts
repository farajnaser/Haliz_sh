import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-LY")} دينار ليبي`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateProfit(retail: number, wholesale: number): number {
  return retail - wholesale;
}

export function calculateProfitMargin(retail: number, wholesale: number): number {
  if (wholesale === 0) return 0;
  return ((retail - wholesale) / wholesale) * 100;
}

export function calculateRetailFromMargin(wholesale: number, marginPercent: number): number {
  return wholesale * (1 + marginPercent / 100);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function generateWhatsAppMessage(
  items: { name: string; nameAr?: string | null; quantity: number; price: number }[],
  storeName = "HALIZ",
  whatsappNumber = "966500000000"
): string {
  const lines = items.map(
    (item) =>
      `• ${item.nameAr || item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
  );
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = [
    `🛍️ طلب جديد من متجر ${storeName}`,
    "",
    ...lines,
    "",
    `💰 الإجمالي: ${formatPrice(total)}`,
    "",
    "أرجو التواصل لتأكيد الطلب 🙏",
  ].join("\n");

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
}
