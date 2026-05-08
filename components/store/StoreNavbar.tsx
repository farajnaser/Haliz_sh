"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Search, Heart, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/store/CartDrawer";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المتجر" },
  { href: "/products?cat=makeup", label: "مكياج" },
  { href: "/products?cat=skincare", label: "عناية بالبشرة" },
  { href: "/products?cat=accessories", label: "إكسسوارات" },
  { href: "/products?cat=perfumes", label: "عطور" },
];

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm shadow-pink-100/50 py-3" : "bg-white py-5"
        }`} 
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* Right side (RTL left) - Icons */}
          <div className="flex items-center gap-5 text-pink-400">
            <button 
              onClick={() => setSearchOpen(true)}
              className="hover:text-pink-500 transition-colors hidden sm:block"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => openCart()}
              className="relative hover:text-pink-500 transition-colors flex items-center gap-1 group"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-sm shadow-pink-200">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="hover:text-pink-500 transition-colors hidden sm:block">
              <Heart className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Center - Logo */}
          <Link 
            href="/" 
            className="text-3xl font-light tracking-[0.3em] uppercase text-pink-950 mx-auto absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
          >
            HALIZ
          </Link>

          {/* Left side (RTL right) - Mobile Menu */}
          <div className="flex items-center gap-4 text-pink-400">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-pink-500 transition-colors sm:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className={`hidden sm:block transition-all duration-300 ${scrolled ? "h-0 overflow-hidden opacity-0" : "mt-6"}`}>
          <ul className="flex items-center justify-center gap-10">
            {navLinks.map((link) => {
              const linkUrl = new URL(link.href, "http://x.com");
              const linkCat = linkUrl.searchParams.get("cat");
              const isActive = (pathname === link.href && !currentCat) || (currentCat === linkCat && !!linkCat && pathname === "/products");
              
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative text-sm font-medium transition-all group ${
                      isActive ? "text-pink-600" : "text-pink-900/60 hover:text-pink-600"
                    }`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-pink-300 transform origin-right transition-transform duration-300 ${
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
          <nav className="sm:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg shadow-pink-100/20 py-4 px-6 border-t border-pink-50">
            <ul className="flex flex-col gap-4">
              <li className="mb-2">
                <form onSubmit={handleSearch} className="relative">
                  <input 
                    type="text" 
                    placeholder="ابحثي عن منتج..." 
                    className="w-full bg-pink-50 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-200"
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
                    className="block text-sm font-medium text-pink-900/70 hover:text-pink-600 hover:pl-2 transition-all"
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
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setSearchOpen(false)}
            className="absolute top-10 right-10 text-pink-950 hover:text-pink-500 transition-colors"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="w-full max-w-3xl space-y-8" dir="rtl">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-light text-pink-950">ابحثي عن جمالك</h2>
              <p className="text-pink-500 font-medium">اكتشفي أرقى المنتجات في متجر HALIZ</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="اكتبي ما تبحثين عنه هنا..." 
                className="w-full bg-transparent border-b-2 border-pink-100 py-6 text-3xl sm:text-4xl font-light text-pink-950 focus:outline-none focus:border-pink-500 transition-colors placeholder:text-pink-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-500">
                <Search className="w-10 h-10" />
              </button>
            </form>
            
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <span className="text-pink-900/40 text-sm font-bold w-full text-center mb-2">كلمات البحث الشائعة:</span>
              {["مكياج", "سيروم", "عطر", "إكسسوارات"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                  }}
                  className="px-6 py-2 rounded-full bg-pink-50 text-pink-600 text-sm font-bold hover:bg-pink-500 hover:text-white transition-all"
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
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <NavbarContent />
      </Suspense>
      <CartDrawer />
      
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/218922612675" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-pink-500 text-white p-4 rounded-full shadow-lg shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </>
  );
}
