"use client";

export default function Newsletter() {
  return (
    <section className="py-32 px-6 bg-pink-50 dark:bg-pink-900/10">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff9ecb]">انضمي لعالم هاليز</span>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
            اشتركي ليصلك كل جديد
          </h2>
          <p className="text-muted-foreground font-bold text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
            كوني أول من يعرف عن أحدث المجموعات، العروض الحصرية، ونصائح الجمال من خبرائنا.
          </p>
        </div>

        <form className="relative max-w-2xl mx-auto group" dir="rtl">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="w-full h-20 pl-44 pr-10 rounded-full bg-background dark:bg-card border-2 border-border focus:border-[#ff9ecb] outline-none text-lg font-bold transition-all duration-500 shadow-sm text-foreground"
          />
          <button
            type="submit"
            className="absolute left-2 top-2 bottom-2 px-10 rounded-full bg-foreground text-background font-black text-sm uppercase tracking-widest hover:bg-[#ff9ecb] hover:text-white transition-all duration-300"
          >
            اشتركي الآن
          </button>
        </form>
        
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
}
