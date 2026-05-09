"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, Heart, ShoppingBag, Menu, X, MessageCircle, Sun, Moon } from "lucide-react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
  const currentCat = searchParams.get("cat");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass border-b border-pink-50/10 py-3 shadow-sm" : "bg-background py-6"
        }`} 
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          
          {/* Right side - Icons */}
          <div className="flex items-center gap-6 text-foreground">
            <button 
              onClick={() => setSearchOpen(true)}
              className="hover:text-[#ff9ecb] transition-all duration-300 hidden sm:block hover:scale-110"
            >
              <Search className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button
              onClick={() => openCart()}
              className="relative hover:text-[#ff9ecb] transition-all duration-300 flex items-center gap-1 group hover:scale-110"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full bg-[#ff85ba] text-white shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="hover:text-[#ff9ecb] transition-all duration-300 hidden sm:block hover:scale-110">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:text-[#ff9ecb] transition-all duration-300 hover:scale-110 flex items-center justify-center w-6 h-6"
            >
              {mounted && (theme === "dark" ? <Sun className="w-6 h-6 stroke-[1.5]" /> : <Moon className="w-6 h-6 stroke-[1.5]" />)}
              {!mounted && <div className="w-6 h-6" />}
            </button>
          </div>

          {/* Center - Logo */}
          <Link 
            href="/" 
            className="text-4xl font-black tracking-tighter text-[#ff9ecb] mx-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-2 drop-shadow-sm hover:scale-105 transition-all duration-500 hover:text-[#ff85ba] hover:drop-shadow-[0_0_15px_rgba(255,158,203,0.5)]"
          >
            HALIZ
          </Link>

          {/* Left side - Mobile Menu */}
          <div className="flex items-center gap-4 text-foreground">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-[#ff9ecb] transition-all duration-300 sm:hidden"
            >
              {mobileMenuOpen ? <X className="w-7 h-7 stroke-[1.5]" /> : <Menu className="w-7 h-7 stroke-[1.5]" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className={`hidden sm:block transition-all duration-500 overflow-hidden ${scrolled ? "h-0 opacity-0" : "mt-8"}`}>
          <ul className="flex items-center justify-center gap-12">
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


        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="sm:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md shadow-lg shadow-pink-100/10 py-4 px-6 border-t border-pink-50/10">
            <ul className="flex flex-col gap-4">
              <li className="mb-2">
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="ابحثي عن منتج..." 
                    className="w-full bg-muted rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </li>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-muted-foreground hover:text-primary hover:pl-2 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setSearchOpen(false)}
            className="absolute top-10 right-10 text-foreground hover:text-primary transition-colors"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="w-full max-w-3xl space-y-8" dir="rtl">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-light text-foreground">ابحثي عن جمالك</h2>
              <p className="text-pink-500 font-medium">اكتشفي أرقى المنتجات في متجر HALIZ</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="اكتبي ما تبحثين عنه هنا..." 
                className="w-full bg-transparent border-b-2 border-border py-6 text-3xl sm:text-4xl font-light text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-500">
                <Search className="w-10 h-10" />
              </button>
            </form>
            
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <span className="text-muted-foreground text-sm font-bold w-full text-center mb-2">كلمات البحث الشائعة:</span>
              {["مكياج", "سيروم", "عطر", "إكسسوارات"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                  }}
                  className="px-6 py-2 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 text-sm font-bold hover:bg-pink-500 hover:text-white transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/218922613675" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-pink-500 text-white p-4 rounded-full shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </>
  );
}
