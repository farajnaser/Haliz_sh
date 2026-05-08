import { Truck, RefreshCw, Shield, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "شحن لجميع المدن", desc: "نغطي كافة مناطق ليبيا بسرعة" },
  { icon: RefreshCw, title: "إرجاع مرن", desc: "سياسة إرجاع مريحة للعملاء" },
  { icon: Shield, title: "دفع آمن", desc: "خيارات دفع موثوقة وآمنة" },
  { icon: Headphones, title: "دعم فني", desc: "متواجدون دائماً لمساعدتك" },
];

export default function ServiceFeatures() {
  return (
    <section className="py-16 border-t border-pink-50" dir="rtl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div 
              key={f.title} 
              className="flex flex-col items-center justify-center text-center group cursor-default"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-50 text-pink-500 mb-5 group-hover:scale-110 group-hover:bg-pink-100 group-hover:text-pink-600 transition-all duration-500">
                <Icon className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-pink-950 text-base mb-2 tracking-wide">{f.title}</h3>
              <p className="text-pink-700/60 text-sm leading-relaxed max-w-[160px] font-medium">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
