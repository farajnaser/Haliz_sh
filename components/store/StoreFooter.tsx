"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

const FACEBOOK_ICON = (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const TIKTOK_ICON = (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

export default function StoreFooter() {
  return (
    <footer className="bg-[#fff0f6] text-[#603b4b] py-20 px-6 w-full max-w-[95%] mx-auto my-8 rounded-[3rem] shadow-sm border border-pink-100" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
          
          {/* Brand & Social Column */}
          <div className="space-y-6 max-w-xs">
            <Link href="/" className="text-3xl font-black tracking-tighter text-[#ff9ecb] hover:text-[#ff85ba] transition-colors">
              HALIZ
            </Link>
            <p className="text-[#a0848f] text-sm font-bold leading-relaxed">
              وجهتك الأولى للأناقة والجمال. نقدم لكِ أرقى المجموعات المختارة بعناية لتناسب ذوقك الرفيع.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/share/18Pwmj1cvH/" target="_blank" className="text-[#ff9ecb] hover:text-[#ff85ba] transition-colors">
                {FACEBOOK_ICON}
              </a>
              <a href="https://www.tiktok.com/@haliz.sh6?_r=1&_t=ZS-96B7G0VXPc1" target="_blank" className="text-[#ff9ecb] hover:text-[#ff85ba] transition-colors">
                {TIKTOK_ICON}
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap md:flex-nowrap gap-16 md:gap-24 w-full md:w-auto">
            {/* Shop Column */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#ff85ba]">التسوق</h4>
              <ul className="space-y-4 text-[#a0848f] font-bold text-sm">
                <li><Link href="/products" className="hover:text-[#ff9ecb] transition-colors">جميع المنتجات</Link></li>
                <li><Link href="/products?cat=makeup" className="hover:text-[#ff9ecb] transition-colors">المكياج</Link></li>
                <li><Link href="/products?cat=skincare" className="hover:text-[#ff9ecb] transition-colors">العناية بالبشرة</Link></li>
                <li><Link href="/products?cat=accessories" className="hover:text-[#ff9ecb] transition-colors">الإكسسوارات</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#ff85ba]">تواصل معنا</h4>
              <ul className="space-y-4 text-[#a0848f] font-bold text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#ff9ecb]" />
                  <span dir="ltr">+218 92 261 2675</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#ff9ecb]" />
                  <span>طرابلس، ليبيا</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-20 pt-8 border-t border-pink-200/50 text-[#a0848f] text-xs font-bold gap-4">
          <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة لمتجر هاليز</p>
          <div className="flex items-center gap-2" dir="ltr">
             <span>ARABIC</span>
             <span className="w-1 h-1 rounded-full bg-pink-200"></span>
             <span>LYD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
