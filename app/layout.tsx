import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ClientProviders from "@/components/ClientProviders";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "HALIZ | هاليز - متجر الهدايا والاكسسوارات", template: "%s | HALIZ" },
  description: "متجر هاليز للهدايا والاكسسوارات - تسوق أحدث المنتجات بأفضل الأسعار",
  keywords: ["هدايا", "اكسسوارات", "تسوق", "HALIZ", "متجر"],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "HALIZ",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <ClientProviders>
          {children}
          <Toaster position="top-center" richColors />
        </ClientProviders>
      </body>
    </html>
  );
}
