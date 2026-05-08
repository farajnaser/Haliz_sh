import { Truck, RefreshCw, Shield, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "شحن لجميع المدن", desc: "نغطي كافة مناطق ليبيا بسرعة" },
  { icon: RefreshCw, title: "إرجاع مرن", desc: "إرجاع واستبدال خلال يومين" },
  { icon: Shield, title: "دفع آمن", desc: "خيارات دفع موثوقة وآمنة" },
  { icon: Headphones, title: "دعم فني", desc: "متواجدون دائماً لمساعدتك" },
];

export default function ServiceFeatures() {
  return (
    <section className="py-24" dir="rtl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div 
              key={f.title} 
              className="flex flex-col items-center justify-center text-center group cursor-default"
            >
              <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-[#fff0f6] text-[#ff9ecb] mb-6 group-hover:scale-110 group-hover:bg-[#ff9ecb] group-hover:text-white transition-all duration-700 soft-shadow border border-white">
                <Icon className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-black text-[#1a1a1a] text-lg mb-2 tracking-tight">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[180px] font-bold opacity-70">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
