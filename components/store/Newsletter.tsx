"use client";

export default function Newsletter() {
  return (
    <section className="py-32 px-6 bg-[#fff0f6]">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff9ecb]">انضمي لعالم هاليز</span>
          <h2 className="text-4xl md:text-6xl font-black text-[#1a1a1a] tracking-tighter">
            اشتركي ليصلك كل جديد
          </h2>
          <p className="text-gray-500 font-bold text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
            كوني أول من يعرف عن أحدث المجموعات، العروض الحصرية، ونصائح الجمال من خبرائنا.
          </p>
        </div>

        <form className="relative max-w-2xl mx-auto group" dir="rtl">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="w-full h-20 pl-44 pr-10 rounded-full bg-white border-2 border-transparent focus:border-[#ff9ecb] outline-none text-lg font-bold transition-all duration-500 shadow-sm"
          />
          <button
            type="submit"
            className="absolute left-2 top-2 bottom-2 px-10 rounded-full bg-[#1a1a1a] text-white font-black text-sm uppercase tracking-widest hover:bg-[#ff9ecb] transition-all duration-300"
          >
            اشتركي الآن
          </button>
        </form>
        
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
}
