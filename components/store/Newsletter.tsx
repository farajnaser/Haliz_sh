"use client";

const FACEBOOK_ICON = (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TIKTOK_ICON = (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.27 1.03-1.51 1.8-.31.82-.2 1.69.25 2.46.35.61.92 1.09 1.58 1.35.81.33 1.68.38 2.53.21 1.25-.21 2.39-.96 2.73-2.16.14-.37.2-.75.2-1.14-.07-4.48-.04-8.96-.06-13.44z"/>
  </svg>
);

export default function Newsletter() {
  return (
    <section className="py-24" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-pink-50 rounded-[4rem] p-12 sm:p-20 relative overflow-hidden flex flex-col items-center text-center">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 max-w-2xl space-y-10">
            <div className="space-y-4">
              <span className="text-pink-500 font-bold tracking-[0.2em] text-xs uppercase">انضمي إلينا</span>
              <h2 className="text-3xl sm:text-5xl font-light text-pink-950 leading-tight">اشتركي في عالم HALIZ</h2>
              <p className="text-pink-900/60 font-medium text-lg">كوني أول من يعرف عن مجموعاتنا الجديدة، العروض الحصرية، ونصائح الجمال من خبرائنا.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <a 
                href="https://www.facebook.com/share/18Pwmj1cvH/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-pink-600 border border-pink-100 px-10 py-5 rounded-full font-bold shadow-xl shadow-pink-100 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span className="group-hover:scale-110 transition-transform">{FACEBOOK_ICON}</span>
                تابعينا على فيسبوك
              </a>
              
              <a 
                href="https://www.tiktok.com/@haliz.sh6?_r=1&_t=ZS-96B7G0VXPc1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-pink-500 text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-pink-200 hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span className="group-hover:scale-110 transition-transform">{TIKTOK_ICON}</span>
                تابعينا على تيك توك
              </a>
            </div>
            
            <p className="text-[10px] text-pink-300 font-bold uppercase tracking-widest pt-4">بالانضمام، أنتِ توافقين على سياسة الخصوصية الخاصة بنا</p>
          </div>
        </div>
      </div>
    </section>
  );
}
