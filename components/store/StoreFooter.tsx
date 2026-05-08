import { MapPin, Phone, MessageCircle } from "lucide-react";

const FACEBOOK_ICON = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TIKTOK_ICON = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.27 1.03-1.51 1.8-.31.82-.2 1.69.25 2.46.35.61.92 1.09 1.58 1.35.81.33 1.68.38 2.53.21 1.25-.21 2.39-.96 2.73-2.16.14-.37.2-.75.2-1.14-.07-4.48-.04-8.96-.06-13.44z"/>
  </svg>
);

export default function StoreFooter() {
  return (
    <footer className="bg-pink-50/50 pt-16 pb-8 border-t border-pink-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-pink-950">
        
        {/* Right Section - Logo and Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right">
          <h2 className="text-4xl font-black tracking-tighter mb-6 uppercase text-black">GLIMMER</h2>
          <p className="text-xs leading-relaxed max-w-xs text-gray-500 font-medium">
            متجر يضم مستلزمات وشنط وأحذية واكسسوارات يمكن أن تكون مدخلا شاملا لكل ما تحتاجينه من أدوات أساسية وشخصية.
          </p>
        </div>

        {/* Center Section - Links */}
        <div className="flex justify-around md:justify-center md:gap-24 w-full">
          <div>
            <h3 className="font-bold mb-6 text-sm text-pink-900 tracking-wide">الروابط المهمة</h3>
            <ul className="space-y-4">
              <li><a href="/" className="text-sm text-pink-700/70 hover:text-pink-500 font-medium transition-colors">الرئيسية</a></li>
              <li><a href="/products" className="text-sm text-pink-700/70 hover:text-pink-500 font-medium transition-colors">المتجر</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-sm text-pink-900 tracking-wide">روابط المساعدة</h3>
            <ul className="space-y-4 text-sm text-pink-700/70 font-medium">
              <li><a href="#" className="hover:text-pink-500 transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">الاسترجاع</a></li>
            </ul>
          </div>
        </div>

        {/* Left Section - Libya & Social */}
        <div className="flex flex-col items-center md:items-end justify-center h-full gap-6">
          <div className="text-center md:text-left font-bold text-lg mb-2">
            <span className="text-4xl font-black text-pink-300 drop-shadow-sm tracking-wider" style={{ fontFamily: "Impact, sans-serif" }}>Thank You!</span><br/>
            <span className="text-sm mt-3 block text-pink-800/80 font-medium">شحن لجميع مدن<br/>دولة ليبيا 🇱🇾</span>
          </div>
          <div className="flex gap-4 text-pink-400">
            <a href="https://wa.me/218922612675" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-pink-200 bg-white flex items-center justify-center hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/share/18Pwmj1cvH/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-pink-200 bg-white flex items-center justify-center hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300">
              {FACEBOOK_ICON}
            </a>
            <a href="https://www.tiktok.com/@haliz.sh6?_r=1&_t=ZS-96B7G0VXPc1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-pink-200 bg-white flex items-center justify-center hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300">
              {TIKTOK_ICON}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-pink-100/50 flex flex-col items-center justify-center text-center px-4">
        <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-widest">
          © {new Date().getFullYear()} GLIMMER. جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
