import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function OurStory() {
  return (
    <section className="py-24 relative overflow-hidden" dir="rtl">
      {/* Decorative background element */}
      <div className="absolute -left-24 top-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group order-2 md:order-1">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-pink-100">
            <Image 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80" 
              alt="Haliz Beauty" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 to-transparent" />
          </div>
          {/* Floating detail */}
          <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-pink-50 max-w-[200px] hidden sm:block">
            <Sparkles className="w-8 h-8 text-pink-400 mb-3" />
            <p className="text-pink-950 font-bold text-lg leading-tight">منتجات مختارة بعناية فائقة</p>
          </div>
        </div>

        <div className="space-y-8 order-1 md:order-2">
          <div className="space-y-4">
            <span className="text-pink-400 font-bold tracking-widest text-sm uppercase">قصتنا</span>
            <h2 className="text-4xl sm:text-5xl font-light text-pink-950 leading-tight">
              أكثر من مجرد متجر، <br />
              <span className="text-pink-500 font-medium italic">إنه عالمكِ الخاص</span>
            </h2>
          </div>
          
          <div className="space-y-6 text-pink-900/70 text-lg leading-relaxed font-medium">
            <p>
              بدأت رحلة HALIZ بشغف بسيط: توفير أرقى منتجات التجميل والعناية بالبشرة التي تجمع بين الجودة العالمية والأسعار المناسبة لكل سيدة في ليبيا.
            </p>
            <p>
              نحن نؤمن أن الجمال ليس مجرد مظهر، بل هو شعور بالثقة والتميز. لذلك، نقوم باختيار كل قطعة في متجرنا بعناية لتناسب ذوقك الرفيع وتلبي احتياجات بشرتك الفريدة.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <h4 className="text-3xl font-bold text-pink-600 mb-1">100%</h4>
              <p className="text-sm text-pink-800/60 font-bold">منتجات أصلية</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-pink-600 mb-1">+5000</h4>
              <p className="text-sm text-pink-800/60 font-bold">عميلة سعيدة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
