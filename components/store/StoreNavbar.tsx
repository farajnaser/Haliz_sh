"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, Heart, ShoppingBag, Menu, X, MessageCircle, Sun, Moon, Home, Store } from "lucide-react";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/store/CartDrawer";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المتجر" },
  { href: "/products?cat=makeup", label: "مكياج" },
  { href: "/products?cat=skincare", label: "عناية بالبشرة" },
  { href: "/products?cat=accessories", label: "إكسسوارات" },
  { href: "/products?cat=perfumes", label: "عطور" },
  { href: "/products?onSale=true", label: "التخفيضات" },
];

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, openCart } = useCartStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname, searchParams]);

  const totalItems = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
  const currentCat = searchParams.get("cat");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* ─── Top Header ─── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b border-pink-50/10 py-3 shadow-sm" : "bg-background py-4 md:py-6"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between">

          {/* Right side — Icons */}
          <div className="flex items-center gap-3 md:gap-6 text-foreground">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:text-[#ff9ecb] transition-all duration-300 hover:scale-110"
              aria-label="بحث"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
            </button>
            <button
              onClick={() => openCart()}
              className="relative hover:text-[#ff9ecb] transition-all duration-300 flex items-center gap-1 group hover:scale-110"
              aria-label="السلة"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full bg-[#ff85ba] text-white shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="hover:text-[#ff9ecb] transition-all duration-300 hidden sm:block hover:scale-110" aria-label="المفضلة">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:text-[#ff9ecb] transition-all duration-300 hover:scale-110 flex items-center justify-center w-6 h-6"
              aria-label="تغيير الثيم"
            >
              {mounted && (theme === "dark" ? <Sun className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5]" />)}
              {!mounted && <div className="w-5 h-5" />}
            </button>
          </div>

          {/* Center — Logo */}
          <Link
            href="/"
            className="text-3xl md:text-4xl font-black tracking-tighter text-[#ff9ecb] mx-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-2 drop-shadow-sm hover:scale-105 transition-all duration-500 hover:text-[#ff85ba]"
          >
            HALIZ
          </Link>

          {/* Left side — Mobile Menu Button */}
          <div className="flex items-center gap-4 text-foreground">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-[#ff9ecb] transition-all duration-300 md:hidden"
              aria-label="القائمة"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className={`hidden md:block transition-all duration-500 overflow-hidden ${scrolled ? "h-0 opacity-0" : "mt-6"}`}>
          <ul className="flex items-center justify-center gap-10">
            {navLinks.map((link) => {
              const linkUrl = new URL(link.href, "http://x.com");
              const linkCat = linkUrl.searchParams.get("cat");
              const isActive = (pathname === link.href && !currentCat) || (currentCat === linkCat && !!linkCat && pathname === "/products");
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 group ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-2 left-0 w-full h-[2px] bg-[#ff9ecb] transform origin-center transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* ─── Mobile Full-Screen Drawer ─── */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-4/5 max-w-sm bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-2xl font-black tracking-tighter text-[#ff9ecb]">HALIZ</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside Drawer */}
        <div className="px-6 py-4 border-b border-border">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحثي عن منتج..."
              className="w-full bg-muted rounded-2xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const linkUrl = new URL(link.href, "http://x.com");
              const linkCat = linkUrl.searchParams.get("cat");
              const isActive = (pathname === link.href && !currentCat) || (currentCat === linkCat && !!linkCat && pathname === "/products");
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-pink-50 dark:bg-pink-900/30 text-[#ff9ecb]"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ff9ecb]" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 py-5 border-t border-border">
          <a
            href="https://wa.me/218922613675"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            تواصل معنا عبر واتساب
          </a>
        </div>
      </div>

      {/* ─── Search Overlay ─── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-foreground hover:text-primary transition-colors"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          <div className="w-full max-w-3xl space-y-6 md:space-y-8" dir="rtl">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-4xl font-light text-foreground">ابحثي عن جمالك</h2>
              <p className="text-pink-500 font-medium text-sm md:text-base">اكتشفي أرقى المنتجات في متجر HALIZ</p>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input
                autoFocus
                type="text"
                placeholder="اكتبي ما تبحثين عنه هنا..."
                className="w-full bg-transparent border-b-2 border-border py-4 md:py-6 text-2xl md:text-4xl font-light text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-500">
                <Search className="w-7 h-7 md:w-10 md:h-10" />
              </button>
            </form>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <span className="text-muted-foreground text-sm font-bold w-full text-center mb-1">كلمات البحث الشائعة:</span>
              {["مكياج", "سيروم", "عطر", "إكسسوارات"].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-5 py-2 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 text-sm font-bold hover:bg-pink-500 hover:text-white transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile Bottom Navigation Bar ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
        dir="rtl"
      >
        <div className="flex items-center justify-around py-2 px-2">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
              pathname === "/" ? "text-[#ff9ecb]" : "text-muted-foreground"
            }`}
          >
            <Home className="w-5 h-5" strokeWidth={pathname === "/" ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </Link>
          <Link
            href="/products"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
              pathname === "/products" ? "text-[#ff9ecb]" : "text-muted-foreground"
            }`}
          >
            <Store className="w-5 h-5" strokeWidth={pathname === "/products" ? 2.5 : 1.5} />
            <span className="text-[10px] font-bold">المتجر</span>
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-muted-foreground"
          >
            <Search className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold">بحث</span>
          </button>
          <button
            onClick={() => openCart()}
            className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-muted-foreground"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1.5 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full bg-[#ff85ba] text-white">
                {totalItems}
              </span>
            )}
            <span className="text-[10px] font-bold">السلة</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-muted-foreground"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-bold">القائمة</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default function StoreNavbar() {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-background" />}>
        <NavbarContent />
      </Suspense>
      <CartDrawer />

      {/* Floating WhatsApp — Desktop only */}
      <a
        href="https://wa.me/218922613675"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-40 bg-pink-500 text-white p-4 rounded-full shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300 items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </>
  );
}
